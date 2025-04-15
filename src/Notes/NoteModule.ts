import { Module } from '@nestjs/common';
import { NotesService } from './Service/NoteService';
import { NotesController } from './Controllers/NotesController';
import { PrismaModule } from '@/Prisma/PrismaModule';
import { NoteWorker } from './Service/NoteWorker';
import { QUEUE_FILM } from '@/constants';
import { BullModule } from '@nestjs/bull';
import { AIModule } from '@/libs/AI/AIModel';
import { KinopoiskModule } from '@/Integration/KinopoiskModule';

@Module({
  imports: [
    PrismaModule,
    AIModule,
    KinopoiskModule,
    BullModule.registerQueue({
      name: QUEUE_FILM,
    }),
  ],
  providers: [NotesService, NoteWorker],
  controllers: [NotesController],
})
export class NotesModule {}
