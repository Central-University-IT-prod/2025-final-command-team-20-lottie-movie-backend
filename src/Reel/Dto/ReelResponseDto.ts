import { ApiProperty } from '@nestjs/swagger';
import { Film } from '@prisma/client';

export class FilmResponseDto {
  @ApiProperty({ type: Number })
  public id: number;

  @ApiProperty({ type: String })
  public title: string;

  @ApiProperty({ type: String })
  public image: string;

  @ApiProperty({ type: String, nullable: true })
  public description: string | null;

  @ApiProperty({ type: String, enum: ['none', 'saved', 'watched'] })
  public status: 'none' | 'saved' | 'watched';

  @ApiProperty({ type: String, required: false, nullable: true })
  public year: string | null;

  @ApiProperty({ type: [String] })
  public countries: string[];

  @ApiProperty({ type: [String] })
  public genres: string[];

  @ApiProperty({ type: Number, required: false, nullable: true })
  public rating: number | null;

  @ApiProperty({ type: Number })
  public ratingVoteCount: number;

  @ApiProperty({ type: String })
  public posterUrlPreview: string;

  @ApiProperty({ type: String })
  public reelFileName: string;
}

export class ReelResponseDto {
  @ApiProperty({ type: Number })
  public id: number;

  @ApiProperty({ type: FilmResponseDto })
  public film: FilmResponseDto;

  @ApiProperty({ type: Boolean })
  public isLiked: boolean;

  @ApiProperty({ type: Number })
  public likesCount: number;

  static fromFilmModel(
    film: Film,
    isLiked: boolean,
    likesCount: number,
    inWishlist: boolean,
    isWatched: boolean,
  ): ReelResponseDto {
    const status = isWatched ? 'watched' : inWishlist ? 'saved' : 'none';

    return new ReelResponseDto({
      id: film.id,
      film: {
        id: film.id,
        title: film.name,
        // TODO: change to posterUrl??
        image: film.posterUrlPreview,
        description: film.description,
        status,
        year: film.year,
        countries: film.countries,
        genres: film.genres,
        rating: film.rating,
        ratingVoteCount: film.ratingVoteCount,
        posterUrlPreview: film.posterUrlPreview,
        reelFileName:
          film.reelName ??
          (() => {
            throw new Error('Reel name is required');
          })(),
      },
      isLiked,
      likesCount,
    });
  }

  constructor(props: ReelResponseDto) {
    this.id = props.id;
    this.film = props.film;
    this.isLiked = props.isLiked;
    this.likesCount = props.likesCount;
  }
}
