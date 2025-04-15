import { Module } from '@nestjs/common';
import { MatchController } from './Controllers/MatchController';
import { MatchService } from './Service/MatchService';
import { PrismaModule } from '@/Prisma/PrismaModule';

@Module({
  imports: [PrismaModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
