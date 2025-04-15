import { ApiProperty } from '@nestjs/swagger';
import { Film } from '@prisma/client';

export class FilmDto {
  @ApiProperty({ description: 'The unique identifier of the film' })
  id: number;

  @ApiProperty({ description: 'The name of the film' })
  name: string;

  @ApiProperty({ description: 'The year of the film', type: String, nullable: true })
  year: string | null;

  @ApiProperty({ description: 'The description of the film', type: String, nullable: true })
  description: string | null;

  @ApiProperty({ description: 'The countries of the film', type: [String] })
  countries: string[];

  @ApiProperty({ description: 'The genres of the film', type: [String] })
  genres: string[];

  @ApiProperty({ description: 'The rating of the film', type: Number, nullable: true })
  rating: number | null;

  @ApiProperty({ description: 'The number of votes for the film', type: Number, nullable: true })
  ratingVoteCount: number | null;

  @ApiProperty({ description: 'The URL of the poster of the film' })
  posterUrl: string;

  @ApiProperty({ description: 'The URL of the poster preview of the film' })
  posterUrlPreview: string;

  @ApiProperty({ description: 'The reel name of the film', type: String, nullable: true })
  reelName: string | null;

  constructor(
    id: number,
    name: string,
    year: string | null,
    description: string | null,
    countries: string[],
    genres: string[],
    rating: number | null,
    ratingVoteCount: number | null,
    posterUrl: string,
    posterUrlPreview: string,
    reelName: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.description = description;
    this.countries = countries;
    this.genres = genres;
    this.rating = rating;
    this.ratingVoteCount = ratingVoteCount;
    this.posterUrl = posterUrl;
    this.posterUrlPreview = posterUrlPreview;
    this.reelName = reelName;
  }

  public static fromModel(model: Film): FilmDto {
    return new FilmDto(
      model.id,
      model.name,
      model.year,
      model.description,
      model.countries,
      model.genres,
      model.rating,
      model.ratingVoteCount,
      model.posterUrl,
      model.posterUrlPreview,
      model.reelName,
    );
  }
}
