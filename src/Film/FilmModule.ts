import { Module } from '@nestjs/common';
import { PrismaModule } from '@/Prisma/PrismaModule';
import { FilmService } from '@/Film/Service/FilmService';
import { FilmController } from '@/Film/Controller/FilmController';
import { KinopoiskModule } from '@/Integration/KinopoiskModule';

@Module({
  imports: [PrismaModule, KinopoiskModule],
  providers: [FilmService],
  controllers: [FilmController],
})
export class FilmModule {}
