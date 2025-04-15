import { Module } from '@nestjs/common';
import { ReelService } from './ReelService';
import { ReelController } from './ReelController';
import { PrismaModule } from '@/Prisma/PrismaModule';
import { CacheModule } from '@/libs/Cache/CacheModule';
import { FileModule } from '@/File/FileModule';
import { MatchModule } from '@/Match/MatchModule';

@Module({
  imports: [PrismaModule, FileModule, CacheModule, MatchModule],
  providers: [ReelService],
  controllers: [ReelController],
  exports: [ReelService],
})
export class ReelModule {}
