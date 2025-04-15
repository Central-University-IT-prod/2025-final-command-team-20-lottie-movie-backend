import { NoteResponseDto } from './NoteResponseDto';
import { ApiProperty } from '@nestjs/swagger';
export class NotesResponseDto {
  @ApiProperty({ type: [NoteResponseDto] })
  notes: Array<NoteResponseDto>;
}
