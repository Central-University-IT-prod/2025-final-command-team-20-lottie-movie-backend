export class KinopoiskFilmDto {
  nameEn: string;
  nameRu: string;
  nameOriginal: string;
  kinopoiskId: number;
  countries: {
    country: string;
  }[];
  genres: {
    genre: string;
  }[];
  ratingKinopoisk: number;
  ratingImdb: number;
  year: string;
  posterUrl: string;
  description: string;
  posterUrlPreview: string;

  public getName(): string {
    return this.nameRu || this.nameEn || this.nameOriginal;
  }

  public getGenres(): string[] {
    return this.genres.map((g) => g.genre);
  }

  public getCountries(): string[] {
    return this.countries.map((c) => c.country);
  }

  public getRating(): number {
    return this.ratingKinopoisk || this.ratingImdb;
  }
}
