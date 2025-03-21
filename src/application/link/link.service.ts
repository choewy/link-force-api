import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Request } from 'express';
import { And, DataSource, In, LessThanOrEqual, Repository } from 'typeorm';
import { DateTime } from 'luxon';

import { Link } from 'src/domain/entities/link.entity';
import { LinkStatus, LinkType } from 'src/domain/enums';
import { UserSpecification } from 'src/domain/entities/user-specification.entity';
import { LinkStatistics } from 'src/domain/entities/link-statistics.entity';
import { LinkHitHistory } from 'src/domain/entities/link-hit-history.entity';
import { RequestHeader } from 'src/persistent/enums';
import { AppConfigFactory } from 'src/common/config/providers/app-config.factory';
import { ContextService } from 'src/common/context/context.service';
import { RedisService } from 'src/common/redis/redis.service';
import { TimerService } from 'src/common/timer/timer.service';

import { LinkDTO } from './dto/link.dto';
import { GetLinksRequestDTO } from './dto/get-links-request.dto';
import { GetLinksResponseDTO } from './dto/get-links-response.dto';
import { CreateLinkRequestDTO } from './dto/create-link-request.dto';
import { UpdateLinkRequestDTO } from './dto/update-link-request.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LinkService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(UserSpecification)
    private readonly userSpecificationRepository: Repository<UserSpecification>,
    @InjectRepository(LinkStatistics)
    private readonly linkStatisticsRepository: Repository<LinkStatistics>,
    private readonly appConfigFactory: AppConfigFactory,
    private readonly contextService: ContextService,
    private readonly redisService: RedisService,
    private readonly timerService: TimerService,
  ) {}

  async getLinks(param: GetLinksRequestDTO) {
    const [links, count] = await this.linkRepository
      .createQueryBuilder('link')
      .innerJoinAndMapOne('link.statistics', 'link.statistics', 'statistics')
      .where('1 = 1')
      .andWhere('link.userId = :userId', {
        userId: this.contextService.getRequestUserID() ?? '0',
      })
      .skip(param.skip)
      .take(param.take)
      .getManyAndCount();

    return new GetLinksResponseDTO(links, count);
  }

  async getLink(id: string) {
    const link = await this.linkRepository.findOne({
      relations: { statistics: true },
      where: { id, userId: this.contextService.getRequestUserID() },
    });

    if (!link) {
      throw new BadRequestException(`not found link by ${id}`);
    }

    return new LinkDTO(link);
  }

  async createLink(body: CreateLinkRequestDTO) {
    const userId = this.contextService.getRequestUserID();

    const days = userId === null ? 7 : 30;
    const expiredAt = body.type === LinkType.Free ? DateTime.local().plus({ days }).toJSDate() : null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    const link = this.linkRepository.create({
      id: Link.createId(),
      userId,
      url: body.url,
      type: body.type,
      expiredAt,
    });

    try {
      await this.linkRepository.insert(link);
      await this.linkStatisticsRepository.insert({ linkId: link.id });

      if (userId) {
        await this.userSpecificationRepository
          .createQueryBuilder()
          .update({ linkCount: () => 'linkCount + 1' })
          .where({ userId })
          .execute();
      }

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return new LinkDTO(link);
  }

  async hitLink(request: Request, id: string) {
    const ip =
      (Array.isArray(request.headers[RequestHeader.XforwardedFor]) ? request.headers[RequestHeader.XforwardedFor].shift() : request.headers[RequestHeader.XforwardedFor]) ??
      request.ip;

    const linkRepository = this.dataSource.getRepository(Link);
    const link = await linkRepository.findOne({
      select: { id: true, url: true },
      where: { id },
    });

    if (!link || link.status === LinkStatus.Disabled) {
      throw new NotFoundException();
    }

    if (link.expiredAt instanceof Date) {
      const expiredAt = DateTime.fromJSDate(link.expiredAt);

      if (expiredAt && expiredAt.diffNow('milliseconds').get('milliseconds') < 0) {
        throw new NotFoundException();
      }
    }

    await this.dataSource.transaction(async (em) => {
      const linkHitHistoryRepository = em.getRepository(LinkHitHistory);
      await linkHitHistoryRepository.insert(linkHitHistoryRepository.create({ ip, link }));

      const linkStatisticsRepository = em.getRepository(LinkStatistics);
      await linkStatisticsRepository
        .createQueryBuilder()
        .update({ hitCount: () => `hitCount + 1` })
        .where({ linkId: id })
        .execute();
    });

    return new LinkDTO(link);
  }

  async updateLink(id: string, body: UpdateLinkRequestDTO) {
    const linkRepository = this.dataSource.getRepository(Link);
    const link = await linkRepository.findOneBy({ id });

    if (!link || link.userId !== this.contextService.getRequestUserID()) {
      return;
    }

    await linkRepository.update({ id }, { status: body.status && body.status !== link.status ? body.status : undefined });
  }

  async deleteLink(id: string) {
    await this.dataSource.transaction(async (em) => {
      const linkRepository = em.getRepository(Link);
      const link = await linkRepository.findOneBy({ id });

      if (!link || link.userId !== this.contextService.getRequestUserID()) {
        return;
      }

      await linkRepository.softDelete({ id });
      const linkStatisticsRepository = em.getRepository(LinkStatistics);
      await linkStatisticsRepository.softDelete({ linkId: id });
    });
  }

  private createDeleteCronKey() {
    return ['cron', 'delete-link'].join(':');
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleDeleteCron() {
    await this.timerService.sleep(this.timerService.getRandomSeconds(1, 3));

    const key = this.createDeleteCronKey();

    if (await this.redisService.has(key)) {
      return;
    }

    await this.redisService.setValue(key, {
      processId: this.appConfigFactory.getProcessID(),
      startedAt: new Date(),
    });

    await this.dataSource.transaction(async (em) => {
      const linkRepository = em.getRepository(Link);
      const links = await linkRepository.find({
        select: { id: true },
        where: { expiredAt: And(LessThanOrEqual(new Date())) },
      });

      if (links.length === 0) {
        return;
      }

      const linkIds = links.map((link) => link.id);
      await linkRepository.softDelete({ id: In(linkIds) });

      const linkStatisticsRepository = em.getRepository(LinkStatistics);
      await linkStatisticsRepository.softDelete({ linkId: In(linkIds) });
    });

    await this.redisService.removeValue(key);
  }
}
