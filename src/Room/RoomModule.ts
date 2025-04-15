import { Module } from '@nestjs/common';
import { PrismaModule } from '@/Prisma/PrismaModule';
import { RoomService } from '@/Room/Service/RoomService';
import { RoomController } from '@/Room/Controller/RoomController';

@Module({
  imports: [PrismaModule],
  providers: [RoomService],
  controllers: [RoomController],
})
export class RoomModule {}
