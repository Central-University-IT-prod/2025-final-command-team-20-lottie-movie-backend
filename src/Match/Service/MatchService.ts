import { PrismaService } from '@/Prisma/PrismaService';
import { Injectable } from '@nestjs/common';
import { CalculateFilmScoreDto } from './Dto/CalculateFilmScoreDto';
import { FindMatchingFilmsDto } from './Dto/FindMatchingFilmsDto';
import { UserTarget } from './Types/UserTarget';
import { User } from '@prisma/client';
import { NoteResponseDto } from '@/Notes/Service/Dto/NoteResponseDto';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  public async calculateFilmScore(dto: CalculateFilmScoreDto): Promise<number> {
    const { filmTarget, userTarget } = dto;

    let numerator = 0;
    let denominator = 0;

    // Calculate numerator
    for (const country of filmTarget.countries) {
      const userCountryWeight = userTarget.countries[country] ?? 0;
      numerator += userCountryWeight;
    }

    for (const genre of filmTarget.genres) {
      const userGenreWeight = userTarget.genres[genre] ?? 0;
      numerator += userGenreWeight;
    }

    const userYearWeight = userTarget.years[filmTarget.year] ?? 0;
    numerator += userYearWeight;

    // Calculate denominator
    denominator =
      Math.sqrt(
        filmTarget.countries.length + filmTarget.genres.length + (filmTarget.year ? 1 : 0),
      ) *
      Math.sqrt(userTarget.countries.length + userTarget.genres.length + userTarget.years.length);

    const score = numerator / denominator;

    if (isNaN(score)) {
      return 1.0;
    }

    return score;
  }

  public async findMatchingFilms(dto: FindMatchingFilmsDto): Promise<number[]> {
    // spizheno from
    // https://dev.to/trekhleb/weighted-random-algorithm-in-javascript-1pdc
    function weightedRandom<T>(items: T[], weights: number[]): { item: T; index: number } {
      if (items.length !== weights.length) {
        throw new Error('Items and weights must be of the same size');
      }

      if (!items.length) {
        throw new Error('Items must not be empty');
      }

      const cumulativeWeights: number[] = [];
      for (let i = 0; i < weights.length; i += 1) {
        cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
      }

      const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
      const randomNumber = maxCumulativeWeight * Math.random();

      for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
        if (cumulativeWeights[itemIndex] >= randomNumber) {
          return {
            item: items[itemIndex],
            index: itemIndex,
          };
        }
      }

      throw new Error('No item found');
    }

    const { films, userTarget, limit } = dto;

    // Merge user target
    const mergedUserTarget: UserTarget = {
      countries: {},
      genres: {},
      years: {},
    };

    Object.entries(userTarget.countries).forEach(([key, value]) => {
      mergedUserTarget.countries[key] = (mergedUserTarget.countries[key] ?? 0) + value;
    });

    Object.entries(userTarget.genres).forEach(([key, value]) => {
      mergedUserTarget.genres[key] = (mergedUserTarget.genres[key] ?? 0) + value;
    });

    Object.entries(userTarget.years).forEach(([key, value]) => {
      mergedUserTarget.years[key] = (mergedUserTarget.years[key] ?? 0) + value;
    });

    // Calculate scores for each film
    const scores = await Promise.all(
      films.map((film) =>
        this.calculateFilmScore(
          new CalculateFilmScoreDto({
            filmTarget: film.target,
            userTarget: mergedUserTarget,
          }),
        ),
      ),
    );

    // Normalize scores to 0-1 using softmax
    const remainingFilms = [...films];
    const remainingScores = [...scores];
    const chosenFilms = [];

    while (chosenFilms.length < limit && remainingFilms.length > 0) {
      // Normalize remaining scores using softmax
      const normalizedScores = remainingScores.map(
        (score) => Math.exp(score) / remainingScores.reduce((sum, s) => sum + Math.exp(s), 0),
      );

      const { item, index } = weightedRandom(remainingFilms, normalizedScores);
      chosenFilms.push(item);

      // Remove chosen film and score from remaining arrays
      remainingFilms.splice(index, 1);
      remainingScores.splice(index, 1);
    }

    return chosenFilms.map((film) => film.filmId);
  }

  public async findMatchingNotes(
    userId: User['id'],
    userTarget: UserTarget,
  ): Promise<NoteResponseDto[]> {
    const notes = await this.prisma.note.findMany({
      where: {
        userId,
      },
      include: {
        film: true,
      },
    });

    const matchedNotesWithFilms = await this.findMatchingFilms(
      new FindMatchingFilmsDto({
        films: notes
          .filter((note) => note.film !== null)
          .map((note) => {
            const film = note.film;
            if (film) {
              return {
                filmId: film.id,
                target: {
                  countries: film.countries,
                  genres: film.genres,
                  year: film.year ?? '',
                },
              };
            }
            throw new Error('Film not found');
          }),
        userTarget: userTarget,
        limit: 1,
      }),
    );

    const notesWithoutFilms = notes.filter((note) => note.film === null);

    const probabilityToShowWithoutFilm = notesWithoutFilms.length / notes.length;
    console.log(probabilityToShowWithoutFilm);

    if (Math.random() < probabilityToShowWithoutFilm) {
      const randomNote = notesWithoutFilms[Math.floor(Math.random() * notesWithoutFilms.length)];
      return [NoteResponseDto.fromModelWithoutFilm(randomNote)];
    }

    const noteWithFilms = await this.prisma.note.findMany({
      where: {
        filmId: {
          in: matchedNotesWithFilms,
        },
        userId,
      },
      include: {
        film: true,
      },
    });

    return noteWithFilms.map((note) => {
      const film = note.film;
      if (film) {
        return NoteResponseDto.fromModelWithFilm(note, film);
      }
      return NoteResponseDto.fromModelWithoutFilm(note);
    });
    // return matchedNotes.map((note) => {
    // const film = films.find((film) => film.id === note);
    // if (film) {
    //   return NoteResponseDto.fromModelWithFilm(note, film);
    // }
    // return NoteResponseDto.fromModelWithoutFilm(note);
    // });
  }
}
