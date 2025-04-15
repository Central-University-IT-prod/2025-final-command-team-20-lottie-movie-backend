import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({
    description: 'The title of the note. Can be null if not provided.',
    example: 'My Movie Review',
  })
  @IsString()
  title: string | null;

  @ApiProperty({
    description: 'A detailed description of the note. Can be null if not provided.',
    example: 'This movie was fantastic because...',
  })
  @IsString()
  description: string | null;

  @ApiProperty({
    description: 'The ID of the film associated with this note. Can be null if not provided.',
    example: 123,
    type: Number,
  })
  @IsNumber()
  filmId: number | null;

  constructor(title: string | null, description: string | null, filmId: number | null) {
    this.title = title;
    this.description = description;
    this.filmId = filmId;
  }
}
