import { PrismaService } from '@/Prisma/PrismaService';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateNoteDto } from './Dto/UpdateNoteDto';
import { CreateNoteViaTitleDto } from './Dto/CreateNoteViaTitleDto';
import { CreateNoteViaFilmIdDto } from './Dto/CreateNoteViaFilmIdDto';
import { NoteResponseDto } from './Dto/NoteResponseDto';
import { FilmDto } from '@/Film/Service/Dto/FilmDto';
import { FILM_PROCESS, QUEUE_FILM } from '@/constants';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUE_FILM) private filmQueue: Queue,
  ) {}

  async createNoteViaFilmId(userId: string, dto: CreateNoteViaFilmIdDto): Promise<NoteResponseDto> {
    this.logger.verbose(`Creating note with filmId: ${dto.filmId}`);

    const film = await this.prisma.film.findUnique({
      where: { id: dto.filmId },
    });
    if (!film) throw new NotFoundException('Film not found');

    // Delete existing note with the same filmId if it exists
    await this.prisma.note.deleteMany({
      where: {
        userId,
        filmId: dto.filmId,
      },
    });

    const note = await this.prisma.note.create({
      data: { ...dto, userId },
    });

    return NoteResponseDto.fromModelWithFilm(note, FilmDto.fromModel(film));
  }

  async createNoteViaTitle(userId: string, dto: CreateNoteViaTitleDto): Promise<NoteResponseDto> {
    this.logger.verbose(`Creating note with title: ${dto.title}`);

    const note = await this.prisma.note.create({
      data: { ...dto, userId },
    });

    await this.filmQueue.add(FILM_PROCESS, {
      noteId: note.id,
      title: note.title,
      description: note.description,
    });

    return NoteResponseDto.fromModelWithoutFilm(note);
  }

  async findById(id: number): Promise<NoteResponseDto> {
    this.logger.verbose(`Fetching note: ${id}`);

    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { film: true },
    });

    if (!note) throw new NotFoundException('Note not found');

    return note.film
      ? NoteResponseDto.fromModelWithFilm(note, FilmDto.fromModel(note.film))
      : NoteResponseDto.fromModelWithoutFilm(note);
  }

  async delete(id: number): Promise<NoteResponseDto> {
    this.logger.verbose(`Deleting note: ${id}`);

    const note = await this.prisma.note.findUnique({
      where: { id },
      include: { film: true },
    });

    if (!note) throw new NotFoundException('Note not found');

    await this.prisma.note.delete({ where: { id } });

    return note.film
      ? NoteResponseDto.fromModelWithFilm(note, FilmDto.fromModel(note.film))
      : NoteResponseDto.fromModelWithoutFilm(note);
  }

  async update(id: number, dto: UpdateNoteDto): Promise<NoteResponseDto> {
    this.logger.verbose(`Updating note: ${id}`);

    await this.checkNoteExists(id);

    const updatedNote = await this.prisma.note.update({
      where: { id },
      data: dto,
      include: { film: true },
    });

    return updatedNote.film
      ? NoteResponseDto.fromModelWithFilm(updatedNote, FilmDto.fromModel(updatedNote.film))
      : NoteResponseDto.fromModelWithoutFilm(updatedNote);
  }

  async getAllNotes(userId: string): Promise<NoteResponseDto[]> {
    this.logger.verbose(`Fetching all notes for user: ${userId}`);

    const notes = await this.prisma.note.findMany({
      where: { userId },
      include: { film: true },
    });

    return notes.map((note) =>
      note.film
        ? NoteResponseDto.fromModelWithFilm(note, FilmDto.fromModel(note.film))
        : NoteResponseDto.fromModelWithoutFilm(note),
    );
  }

  private async checkNoteExists(id: number): Promise<void> {
    const exists = await this.prisma.note.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Note not found');
  }

  async changeState(id: number): Promise<NoteResponseDto> {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');

    const updatedNote = await this.prisma.note.update({
      where: { id },
      data: { isSeen: !note.isSeen },
    });

    return NoteResponseDto.fromModelWithoutFilm(updatedNote);
  }
}
