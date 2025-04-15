import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/Prisma/PrismaService';
import { FilmDto } from '@/Film/Service/Dto/FilmDto';
import { KinopoiskFilmDto } from '@/Integration/Dto/KinopoiskFilmDto';
import { KinopoiskApi } from '@/Integration/KinopoiskApi';
import { Film } from '@prisma/client';

@Injectable()
export class FilmService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kinopoiskApi: KinopoiskApi,
  ) {}

  public async searchFilms(value: string): Promise<FilmDto[]> {
    const kinopoiskFilmDtos = await this.kinopoiskApi.searchFilms(value);
    const films = await this.upsert(kinopoiskFilmDtos);
    return films.map((f) => FilmDto.fromModel(f));
  }

  public async upsert(kinopoiskFilms: KinopoiskFilmDto[]): Promise<Film[]> {
    return await Promise.all(
      kinopoiskFilms.map(
        async (f) =>
          await this.prisma.film.upsert({
            where: {
              id: f.kinopoiskId,
            },
            create: {
              id: f.kinopoiskId,
              name: f.getName(),
              rating: f.getRating(),
              genres: f.getGenres(),
              countries: f.getCountries(),
              year: f.year.toString(),
              posterUrl: f.posterUrl,
              posterUrlPreview: f.posterUrlPreview,
              ratingVoteCount: 0,
            },
            update: {
              id: f.kinopoiskId,
              name: f.getName(),
              rating: f.getRating(),
              genres: f.getGenres(),
              countries: f.getCountries(),
              year: f.year.toString(),
              posterUrl: f.posterUrl,
              posterUrlPreview: f.posterUrlPreview,
              ratingVoteCount: 0,
            },
          }),
      ),
    );
  }
}
