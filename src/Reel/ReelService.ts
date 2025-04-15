import { PrismaService } from '@/Prisma/PrismaService';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetReelsDto } from './Dto/GetReelsDto';
import { User } from '@prisma/client';
import { ReelResponseDto } from './Dto/ReelResponseDto';
import { CacheService } from '@/libs/Cache/CacheService';
import { UserTarget } from '@/Match/Service/Types/UserTarget';
import { MatchService } from '@/Match/Service/MatchService';

@Injectable()
export class ReelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
    private readonly matchService: MatchService,
  ) {}

  async getReels(user: User, dto: GetReelsDto): Promise<ReelResponseDto[]> {
    const films = await this.prisma.film.findMany({
      where: {
        reelName: { not: null },
      },
    });

    if (
      dto.startFromId &&
      (await this.prisma.film.count({ where: { id: dto.startFromId } })) == 0
    ) {
      dto.startFromId = null;
    }

    const reels = [
      ...(dto.startFromId ? [dto.startFromId] : []),
      ...(await this.matchService.findMatchingFilms({
        films: films.map((film) => ({
          filmId: film.id,
          target: {
            countries: film.countries,
            genres: film.genres,
            year: film.year ?? '',
          },
        })),
        userTarget: user.target as unknown as UserTarget,
        limit: dto.limit ?? 10,
      })),
    ];

    return Promise.all(
      reels.map(async (filmId) => {
        const film = films.find((film) => film.id === filmId);
        if (!film) {
          throw new BadRequestException('Film not found');
        }
        const isLiked =
          (await this.prisma.reelLike.count({
            where: { filmId: film.id, userId: user.id },
          })) > 0;
        const likesCount = await this.prisma.reelLike.count({
          where: { filmId: film.id },
        });

        const inWatchList =
          (await this.prisma.note.count({
            where: { filmId: film.id, userId: user.id },
          })) > 0;

        return ReelResponseDto.fromFilmModel(film, isLiked, likesCount, inWatchList, false);
      }),
    );
  }

  async viewReel(user: User, filmId: number): Promise<number> {
    const key = this.cacheService.keys.reelViews(user.id, filmId);
    return this.cacheService.increment(key);
  }

  async likeReel(user: User, filmId: number): Promise<void> {
    try {
      await this.prisma.reelLike.create({
        data: {
          filmId,
          userId: user.id,
        },
      });
    } catch (error) {
      throw new BadRequestException('Reel already liked');
    }

    const target = user.target as unknown as UserTarget;
    const film = await this.prisma.film.findUnique({
      where: {
        id: filmId,
      },
    });

    if (!film) {
      throw new BadRequestException('Film not found');
    }

    // Increment genre counts
    if (film.genres && target?.genres) {
      for (const genre of film.genres) {
        const currentCount = (target.genres as Record<string, number>)[genre] || 0;
        (target.genres as Record<string, number>)[genre] = currentCount + 1;
      }
    }

    // Increment year count
    if (film.year && target?.years) {
      const currentCount = (target.years as Record<string, number>)[film.year] || 0;
      (target.years as Record<string, number>)[film.year] = currentCount + 1;
    }

    // Increment country counts
    if (film.countries && target?.countries) {
      for (const country of film.countries) {
        const currentCount = (target.countries as Record<string, number>)[country] || 0;
        (target.countries as Record<string, number>)[country] = currentCount + 1;
      }
    }

    // Update user with new target data
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        target: {
          genres: target?.genres || {},
          years: target?.years || {},
          countries: target?.countries || {},
        },
      },
    });
  }

  async getMyReels(user: User, limit: number, offset: number): Promise<ReelResponseDto[]> {
    const reels = await this.prisma.film.findMany({
      where: {
        reelName: { not: null },
        ReelLike: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        ReelLike: true,
      },
    });

    return Promise.all(
      reels
        .map((reel) => ({
          id: reel.id,
          name: reel.name,
          year: reel.year,
          description: reel.description,
          countries: reel.countries,
          genres: reel.genres,
          rating: reel.rating,
          ratingVoteCount: reel.ratingVoteCount,
          posterUrl: reel.posterUrl,
          posterUrlPreview: reel.posterUrlPreview,
          reelName: reel.reelName,
          likedAt: reel.ReelLike.find((like) => like.userId === user.id)?.createdAt,
        }))
        .sort((a, b) => (b.likedAt?.getTime() ?? 0) - (a.likedAt?.getTime() ?? 0))
        .slice(offset, offset + limit)
        .map(async (reel) => {
          const isLiked =
            (await this.prisma.reelLike.count({
              where: { filmId: reel.id, userId: user.id },
            })) > 0;
          const likesCount = await this.prisma.reelLike.count({
            where: { filmId: reel.id },
          });

          const inWatchList =
            (await this.prisma.note.count({
              where: { filmId: reel.id, userId: user.id },
            })) > 0;

          return ReelResponseDto.fromFilmModel(reel, isLiked, likesCount, inWatchList, false);
        }),
    );
  }
}
