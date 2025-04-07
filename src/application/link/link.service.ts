import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import { DateTime } from 'luxon';

import { ContextService } from 'src/common/context/context.service';

import { UserSpecification } from '../user/entities/user-specification.entity';
import { TotalStatistics } from '../statistics/entities/total-statistics.entity';
import { DaliyStatistics } from '../statistics/entities/daliy-statistics.entity';
import { HitHistory } from '../history/entities/hit-history.entity';

import { LinkStatus } from './persistents/enums';
import { Link } from './entities/link.entity';
import { LinkDTO } from './dto/link.dto';
import { GetLinksQueryDTO } from './dto/get-links.dto';
import { GetLinksResultDTO } from './dto/get-links-result.dto';
import { CreateLinkDTO, CreateLinkResultDTO } from './dto/create-link.dto';
import { UpdateLinkDTO } from './dto/update-link.dto';
import { HitLinkResultDTO } from './dto/hit-link-result.dto';

@Injectable()
export class LinkService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(TotalStatistics)
    private readonly totalStatisticsRepository: Repository<TotalStatistics>,
    @InjectRepository(DaliyStatistics)
    private readonly daliyStatisticsRepository: Repository<DaliyStatistics>,
    @InjectRepository(HitHistory)
    private readonly hitHistoryRepository: Repository<HitHistory>,
    @InjectRepository(UserSpecification)
    private readonly userSpecificationRepository: Repository<UserSpecification>,
    private readonly contextService: ContextService,
  ) {}

  async getLinks(param: GetLinksQueryDTO) {
    const [links, count] = await this.linkRepository
      .createQueryBuilder('link')
      .innerJoinAndMapOne('link.totalStatistics', 'link.totalStatistics', 'totalStatistics')
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
      relations: { totalStatistics: true },
      where: { id, userId: this.contextService.getRequestUserID() },
    });

    if (!link) {
      throw new BadRequestException(`not found link by ${id}`);
    }

    return new LinkDTO(link);
  }

  async createLink(body: CreateLinkDTO): Promise<CreateLinkResultDTO> {
    const userId = this.contextService.getRequestUserID();
    const link = this.linkRepository.create({
      userId,
      url: body.url,
      expiredAt: userId === null ? DateTime.local().plus({ days: 30 }).toJSDate() : null,
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

      await this.totalStatisticsRepository.insert({ linkId: link.id });

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

    return new CreateLinkResultDTO(link);
  }

  async hitLink(id: string): Promise<HitLinkResultDTO> {
    const link = await this.linkRepository.findOne({
      relations: { user: { membership: true } },
      where: { id },
    });

    if (!link || link.status === LinkStatus.Disabled) {
      throw new BadRequestException(`not found link by ${id}`);
    }

    if (link.expiredAt instanceof Date) {
      const expiredAt = DateTime.fromJSDate(link.expiredAt);

      if (expiredAt && expiredAt.diffNow('milliseconds').get('milliseconds') < 0) {
        throw new BadRequestException('link has expired');
      }
    }

    const date = DateTime.local().toJSDate();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await this.hitHistoryRepository.insert({
        ip: this.contextService.getRequestIP(),
        userAgent: this.contextService.getRequestUserAgent(),
        referer: this.contextService.getRequestReferer(),
        link,
      });

      await this.totalStatisticsRepository
        .createQueryBuilder()
        .update({ hitCount: () => `hitCount + 1` })
        .where({ linkId: id })
        .execute();

      await this.daliyStatisticsRepository.upsert({ linkId: id, date }, { conflictPaths: ['linkId', 'date'], skipUpdateIfNoValuesChanged: true });
      await this.daliyStatisticsRepository
        .createQueryBuilder()
        .update({ hitCount: () => `hitCount + 1` })
        .where({ linkId: id, date })
        .execute();
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }

    return new HitLinkResultDTO(link, link.user?.membership == null);
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
      await this.hitHistoryRepository.softDelete({ linkId: id });
      await this.totalStatisticsRepository.softDelete({ linkId: id });
      await this.daliyStatisticsRepository.softDelete({ linkId: id });

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
