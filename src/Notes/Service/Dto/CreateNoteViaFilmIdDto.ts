import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteViaFilmIdDto {
  @ApiProperty({
    example: 12345,
    description: 'Id of the film',
  })
  @IsInt()
  filmId: number;
}
