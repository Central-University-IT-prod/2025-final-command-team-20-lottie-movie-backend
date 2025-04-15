import { UserTarget } from '@/Match/Service/Types/UserTarget';

export class FindMatchingFilmsDto {
  films: Array<{
    filmId: number;
    target: {
      countries: string[];
      genres: string[];
      year: string;
    };
  }>;
  userTarget: UserTarget;
  limit: number = 1;

  constructor(props: FindMatchingFilmsDto) {
    this.films = props.films;
    this.userTarget = props.userTarget;
    this.limit = props.limit;
  }
}
