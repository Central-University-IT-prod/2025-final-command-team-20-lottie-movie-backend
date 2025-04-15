import { Module } from '@nestjs/common';
import { PrismaModule } from '@/Prisma/PrismaModule';
import { KinopoiskApi } from '@/Integration/KinopoiskApi';

@Module({
  imports: [PrismaModule],
  providers: [KinopoiskApi],
  exports: [KinopoiskApi],
})
export class KinopoiskModule {}
