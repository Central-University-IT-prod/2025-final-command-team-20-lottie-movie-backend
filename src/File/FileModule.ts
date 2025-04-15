import { Module } from '@nestjs/common';
import { FileService } from '@/File/Service/FileService';
import { ConfigModule } from '@nestjs/config';
import { FileController } from '@/File/FileController';
import { PrismaModule } from '@/Prisma/PrismaModule';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
