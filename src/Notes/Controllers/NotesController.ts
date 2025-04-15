import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAccessGuard } from '@/Auth/JwtAccessGuard';
import { CurrentUser } from '@/Auth/CurrentUserDecorator';
import { User } from '@prisma/client';
import { NotesService } from '@/Notes/Service/NoteService';
import { CreateNoteViaFilmIdDto } from '../Service/Dto/CreateNoteViaFilmIdDto';
import { CreateNoteViaTitleDto } from '../Service/Dto/CreateNoteViaTitleDto';
import { UpdateNoteDto } from '../Service/Dto/UpdateNoteDto';
import { NoteResponseDto } from '../Service/Dto/NoteResponseDto';
import { NotesResponseDto } from '../Service/Dto/NotesResponseDto';

@ApiTags('notes')
@Controller('notes')
@ApiBearerAuth('jwt-access')
@UseGuards(JwtAccessGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a note via title' })
  @ApiResponse({ status: 201, description: 'Note created successfully.', type: NoteResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createNoteViaTitle(
    @CurrentUser() user: User,
    @Body() createNoteViaTitle: CreateNoteViaTitleDto,
  ): Promise<NoteResponseDto> {
    return this.notesService.createNoteViaTitle(user.id, createNoteViaTitle);
  }

  @Post('viaFilmId')
  @ApiOperation({ summary: 'Create a note via film ID' })
  @ApiResponse({ status: 201, description: 'Note created successfully.', type: NoteResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createNoteViaFilmId(
    @CurrentUser() user: User,
    @Body() createNoteViaFilmIdDto: CreateNoteViaFilmIdDto,
  ): Promise<NoteResponseDto> {
    return this.notesService.createNoteViaFilmId(user.id, createNoteViaFilmIdDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note by ID' })
  @ApiResponse({ status: 200, description: 'Note updated successfully.', type: NoteResponseDto })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<NoteResponseDto> {
    return this.notesService.update(id, updateNoteDto);
  }

  @Post(':id/changeState')
  @ApiOperation({ summary: 'Change the state of a note' })
  @ApiResponse({
    status: 200,
    description: 'Note state changed successfully.',
    type: NoteResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async changeNoteState(@Param('id', ParseIntPipe) id: number): Promise<NoteResponseDto> {
    return this.notesService.changeState(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all notes for the current user' })
  @ApiResponse({ status: 200, description: 'Return all notes.', type: NotesResponseDto })
  async getAllNotes(@CurrentUser() user: User): Promise<NotesResponseDto> {
    return {
      notes: await this.notesService.getAllNotes(user.id),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a note by ID' })
  @ApiResponse({ status: 200, description: 'Return the note.', type: NoteResponseDto })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async getNoteById(@Param('id', ParseIntPipe) id: number): Promise<NoteResponseDto> {
    return this.notesService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note by ID' })
  @ApiResponse({ status: 204, description: 'Note deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async deleteNoteById(@Param('id', ParseIntPipe) id: number) {
    await this.notesService.delete(id);
  }
}
