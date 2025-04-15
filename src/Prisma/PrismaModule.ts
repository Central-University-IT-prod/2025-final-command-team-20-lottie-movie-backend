import { Module } from '@nestjs/common';
import { PrismaService } from '@/Prisma/PrismaService';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
