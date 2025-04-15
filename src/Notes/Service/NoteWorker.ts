import { Processor, Process, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { KinopoiskApi } from '@/Integration/KinopoiskApi';
import { FILM_PROCESS, QUEUE_FILM } from '@/constants';
import { AIService } from '@/libs/AI/AIService';
import { PrismaService } from '@/Prisma/PrismaService';

@Processor(QUEUE_FILM)
export class NoteWorker {
  private logger = new Logger(NoteWorker.name);

  constructor(
    private readonly aiService: AIService,
    private readonly kinopoiskApi: KinopoiskApi,
    private readonly prisma: PrismaService,
  ) {}

  @Process(FILM_PROCESS)
  async handleProcessFilm(job: Job) {
    const { noteId, title, description } = job.data;
    this.logger.debug(`Processing film for noteId: ${noteId}, title: ${title}`);

    try {
      const aiResponse = await this.aiService.findFilmTitle(title, description);

      const kinoResponse = await this.kinopoiskApi.searchFilms(aiResponse);

      const film = kinoResponse[0];

      await this.prisma.film.upsert({
        where: { id: film.kinopoiskId },
        create: {
          id: film.kinopoiskId,
          name: film.getName(),
          rating: film.getRating(),
          genres: film.getGenres(),
          countries: film.getCountries(),
          year: film.year,
          posterUrl: film.posterUrl,
          posterUrlPreview: film.posterUrlPreview,
          ratingVoteCount: 0,
        },
        update: {
          name: film.getName(),
          rating: film.getRating(),
          genres: film.getGenres(),
          countries: film.getCountries(),
          year: film.year,
          posterUrl: film.posterUrl,
          posterUrlPreview: film.posterUrlPreview,
          ratingVoteCount: 0,
        },
      });

      await this.prisma.note.update({
        where: { id: noteId },
        data: {
          filmId: film.kinopoiskId,
        },
      });

      job.progress(100);
      this.logger.verbose(`Successfully processed film for noteId: ${noteId}`);
    } catch (error) {
      this.logger.error(`Failed to process film for noteId: ${noteId}`, error.stack);
      throw error;
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.verbose(`Job ${job.id} completed successfully`);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: any) {
    this.logger.error(`Job ${job.id} failed with error ${error.message}`);
  }
}
