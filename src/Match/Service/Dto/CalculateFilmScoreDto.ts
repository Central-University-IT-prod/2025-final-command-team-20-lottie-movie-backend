import { Film } from '@prisma/client';
import { UserTarget } from '@/Match/Service/Types/UserTarget';

export class CalculateFilmScoreDto {
  filmTarget: {
    countries: string[];
    genres: string[];
    year: string;
  };

  userTarget: UserTarget;

  constructor(props: CalculateFilmScoreDto) {
    this.filmTarget = props.filmTarget;
    this.userTarget = props.userTarget;
  }

  static fromFilm(film: Film, userTarget: UserTarget): CalculateFilmScoreDto {
    return new CalculateFilmScoreDto({
      filmTarget: {
        countries: film.countries,
        genres: film.genres,
        year: film.year ?? '',
      },
      userTarget: userTarget,
    });
  }
}
