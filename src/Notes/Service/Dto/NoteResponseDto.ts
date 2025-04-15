import { ApiProperty } from '@nestjs/swagger';
import { FilmDto } from '@/Film/Service/Dto/FilmDto';
import { Note } from '@prisma/client';

export class NoteResponseDto {
  @ApiProperty({ description: 'The unique identifier of the note' })
  public id: number;

  @ApiProperty({ description: 'The title of the note', type: String, nullable: true })
  public title: string | null;

  @ApiProperty({ description: 'The description of the note', type: String, nullable: true })
  public description: string | null;

  @ApiProperty({
    description: 'The associated film for this note',
    type: FilmDto,
    nullable: true,
  })
  public film: FilmDto | null;

  @ApiProperty({ description: 'Whether the note has been seen', type: Boolean })
  public isSeen: boolean;

  @ApiProperty({ description: 'The date of the note' })
  public type: 'text' | 'film';

  constructor(
    id: number,
    title: string | null,
    description: string | null,
    film: FilmDto | null,
    isSeen: boolean,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.film = film;
    this.isSeen = isSeen;
    this.type = film ? 'film' : 'text';
  }

  static fromModelWithFilm(note: Note, film: FilmDto) {
    return new NoteResponseDto(note.id, note.title, note.description, film, note.isSeen);
  }

  static fromModelWithoutFilm(note: Note) {
    return new NoteResponseDto(note.id, note.title, note.description, null, note.isSeen);
  }
}
