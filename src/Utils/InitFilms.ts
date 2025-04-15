import { PrismaService } from '@/Prisma/PrismaService';
import * as fs from 'fs';

const FILMS_PATH = './scripts/data/films.json';

export interface FilmData {
  keyword: string;
  pagesCount: number;
  films: Film[];
}

export interface Film {
  filmId: number;
  nameRu: string;
  nameEn: string;
  type: string;
  year: string;
  description: string;
  filmLength?: string; // Опционально, так как не во всех фильмах указано
  countries: Country[];
  genres: Genre[];
  rating: string | null;
  ratingVoteCount: number;
  posterUrl: string;
  posterUrlPreview: string;
}

export interface Country {
  country: string;
}

export interface Genre {
  genre: string;
}

export const initFilms = async (prisma: PrismaService) => {
  const data = fs.readFileSync(FILMS_PATH, 'utf8');
  const films = JSON.parse(data) as FilmData[];

  const allFilms = films
    .flatMap((filmData) => filmData.films)
    .filter((filmData) => filmData.type == 'FILM');

  const existingFilms = await prisma.film.count();
  if (existingFilms > 500) {
    console.log('Films already initialized');
    return;
  }

  const updatePromises = allFilms.map((film) =>
    prisma.film.upsert({
      where: { id: film.filmId },
      update: {
        name: film.nameRu || film.nameEn,
        year: film.year,
        description: film.description,
        rating: isNaN(parseFloat(film.rating || '0')) ? 0 : parseFloat(film.rating || '0'),
        ratingVoteCount: film.ratingVoteCount,
        posterUrl: film.posterUrl,
        posterUrlPreview: film.posterUrlPreview,
        countries: film.countries.map((c) => c.country),
        genres: film.genres.map((g) => g.genre),
      },
      create: {
        id: film.filmId,
        name: film.nameRu || film.nameEn,
        year: film.year,
        description: film.description,
        rating: isNaN(parseFloat(film.rating || '0')) ? 0 : parseFloat(film.rating || '0'),
        ratingVoteCount: film.ratingVoteCount,
        posterUrl: film.posterUrl,
        posterUrlPreview: film.posterUrlPreview,
        countries: film.countries.map((c) => c.country),
        genres: film.genres.map((g) => g.genre),
      },
    }),
  );

  const updatePromise = Promise.all(updatePromises);

  await updatePromise;
};
