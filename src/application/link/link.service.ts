import { Injectable, NotFoundException } from '@nestjs/common';

import { DataSource } from 'typeorm';
import { DateTime } from 'luxon';

import { AppConfigFactory } from 'src/config/providers/app-config.factory';
import { Link } from 'src/domain/entities/link.entity';
import { LinkType } from 'src/domain/enums';
import { UserSpecification } from 'src/domain/entities/user-specification.entity';
import { LinkStatistics } from 'src/domain/entities/link-statistics.entity';
import { LinkHitHistory } from 'src/domain/entities/link-hit-history.entity';
import { ContextService } from 'src/context/context.service';

import { CreateLinkRequestDTO } from './dto/create-link-request.dto';
import { CreateLinkResponseDTO } from './dto/create-link-response.dto';
import { HitLinkResponseDTO } from './dto/hit-link-response.dto';

@Injectable()
export class LinkService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly appConfigFactory: AppConfigFactory,
    private readonly contextService: ContextService,
  ) {}

  async createLink(body: CreateLinkRequestDTO) {
    const userId = this.contextService.getRequestUserID();

    const days = userId === null ? 7 : 30;
    const expiredAt = body.type === LinkType.Free ? DateTime.local().plus({ days }).toJSDate() : null;

    const link = await this.dataSource.transaction(async (em) => {
      const linkStatisticsRepository = em.getRepository(LinkStatistics);
      const linkStatistics = linkStatisticsRepository.create();

      const linkRepository = em.getRepository(Link);
      const link = linkRepository.create({ url: body.url, type: body.type, expiredAt, statistics: linkStatistics });

      while (true) {
        link.id = link.createId();

        const hasId = await linkRepository.exists({
          select: { id: true },
          where: { id: link.id },
          lock: { mode: 'pessimistic_write' },
          take: 1,
        });

        if (!hasId) {
          break;
        }
      }

      await linkRepository.insert(link);

      if (userId) {
        const userSpecificationRepository = em.getRepository(UserSpecification);
        await userSpecificationRepository
          .createQueryBuilder()
          .update({ linkCount: () => 'linkCount + 1' })
          .where({ userId })
          .execute();
      }

      return link;
    });

    return new CreateLinkResponseDTO(this.appConfigFactory.getLinkBaseURL(), link);
  }

  async hitLink(linkId: string) {
    const linkRepository = this.dataSource.getRepository(Link);
    const link = await linkRepository.findOne({
      select: { id: true, url: true, statusCode: true },
      where: { id: linkId },
    });

    if (!link) {
      throw new NotFoundException();
    }

    if (link.expiredAt instanceof Date) {
      const expiredAt = DateTime.fromJSDate(link.expiredAt);

      if (expiredAt && expiredAt.diffNow('milliseconds').get('milliseconds') < 0) {
        throw new NotFoundException();
      }
    }

    await this.dataSource.transaction(async (em) => {
      const linkStatisticsRepository = em.getRepository(LinkStatistics);
      const linkHitHistoryRepository = em.getRepository(LinkHitHistory);

      await linkStatisticsRepository
        .createQueryBuilder()
        .update({ hitCount: () => `hitCount + 1` })
        .where({ linkId })
        .execute();

      await linkHitHistoryRepository.insert(linkHitHistoryRepository.create({ link }));
    });

    return new HitLinkResponseDTO(link);
  }
}
