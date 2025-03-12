import { DataSource } from 'typeorm';
import { DateTime } from 'luxon';

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLinkRequestDTO } from './dto/create-link-request.dto';
import { Link } from 'src/domain/entities/link.entity';
import { LinkType } from 'src/domain/constants';
import { ServerConfigFactory } from 'src/config/providers/server-config.factory';
import { CreateLinkResponseDTO } from './dto/create-link-response.dto';
import { LinkStatistics } from 'src/domain/entities/link-statistics.entity';
import { LinkHitHistory } from 'src/domain/entities/link-hit-history.entity';
import { HitLinkResponseDTO } from './dto/hit-link-response.dto';

@Injectable()
export class LinkService {
  constructor(
    private readonly serverConfigFactory: ServerConfigFactory,
    private readonly dataSource: DataSource,
  ) {}

  async createLink(body: CreateLinkRequestDTO) {
    const link = await this.dataSource.transaction(async (em) => {
      const linkRepository = em.getRepository(Link);
      const link = linkRepository.create();

      // TODO 사용자 계정으로 링크 생성 시 결제 플랜에 따라 유효기간 카운팅
      // TODO 무료 계정 비회원으로 링크 생성 시 7일 제한

      link.type = LinkType.FreeTrial;
      link.url = body.url;
      link.expiredAt = DateTime.local().plus({ days: 7 }).toJSDate();

      while (true) {
        link.id = link.createId();

        const hasId = await linkRepository.exists({
          select: { id: true },
          where: { id: link.id },
          take: 1,
          lock: { mode: 'pessimistic_write' },
        });

        if (!hasId) {
          break;
        }
      }

      await linkRepository.insert(link);

      const linkStatisticsRepository = em.getRepository(LinkStatistics);
      await linkStatisticsRepository.insert({ link });

      return link;
    });

    return new CreateLinkResponseDTO(this.serverConfigFactory.getHost(), link);
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
