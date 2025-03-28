import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Request } from 'express';
import { DataSource, Repository } from 'typeorm';
import { DateTime } from 'luxon';

import { RequestHeader } from 'src/persistent/enums';
import { ContextService } from 'src/common/context/context.service';

import { UserSpecification } from '../user/entities/user-specification.entity';

import { LinkStatus, LinkType } from './persistencts/enums';
import { Link } from './entities/link.entity';
import { LinkStatistics } from './entities/link-statistics.entity';
import { LinkHitHistory } from './entities/link-hit-history.entity';
import { LinkDTO } from './dto/link.dto';
import { GetLinksDTO } from './dto/get-links.dto';
import { GetLinksResultDTO } from './dto/get-links-result.dto';
import { CreateLinkDTO } from './dto/create-link.dto';
import { UpdateLinkDTO } from './dto/update-link.dto';

@Injectable()
export class LinkService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(LinkStatistics)
    private readonly linkStatisticsRepository: Repository<LinkStatistics>,
    @InjectRepository(LinkHitHistory)
    private readonly linkHitHistoryRepository: Repository<LinkHitHistory>,
    @InjectRepository(UserSpecification)
    private readonly userSpecificationRepository: Repository<UserSpecification>,
    private readonly contextService: ContextService,
  ) {}

  async getLinks(param: GetLinksDTO) {
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

    return new GetLinksResultDTO(links, count);
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

  async createLink(body: CreateLinkDTO) {
    const userId = this.contextService.getRequestUserID();
    const link = this.linkRepository.create({
      userId,
      url: body.url,
      type: body.type,
      expiredAt:
        body.type === LinkType.Free
          ? DateTime.local()
              .plus({ days: userId === null ? 7 : 30 })
              .toJSDate()
          : null,
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      let retryCount = 0;

      while (retryCount < 20) {
        link.id = Link.createId();

        const isInserted = await this.linkRepository
          .insert(link)
          .then(() => true)
          .catch(() => false);

        if (isInserted) {
          break;
        }

        retryCount++;
      }

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

    const link = await this.linkRepository.findOneBy({ id });

    if (!link || link.status === LinkStatus.Disabled) {
      throw new BadRequestException(`not found link by ${id}`);
    }

    if (link.expiredAt instanceof Date) {
      const expiredAt = DateTime.fromJSDate(link.expiredAt);

      if (expiredAt && expiredAt.diffNow('milliseconds').get('milliseconds') < 0) {
        throw new BadRequestException('link has expired');
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.linkHitHistoryRepository.insert({ ip, link });
      await this.linkStatisticsRepository
        .createQueryBuilder()
        .update({ hitCount: () => `hitCount + 1` })
        .where({ linkId: id })
        .execute();

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return new LinkDTO(link);
  }

  async updateLink(id: string, body: UpdateLinkDTO) {
    const link = await this.linkRepository.findOneBy({ id });

    if (!link || link.userId !== this.contextService.getRequestUserID()) {
      return;
    }

    await this.linkRepository.update({ id }, { status: body.status && body.status !== link.status ? body.status : undefined });
  }

  async deleteLink(id: string) {
    const link = await this.linkRepository.findOneBy({ id });

    if (!link || link.userId !== this.contextService.getRequestUserID()) {
      return;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.linkRepository.softDelete({ id });
      await this.linkStatisticsRepository.softDelete({ linkId: id });

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
