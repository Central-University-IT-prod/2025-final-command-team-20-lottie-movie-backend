import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/Prisma/PrismaService';
import { RoomDto } from '@/Room/Service/Dto/RoomDto';
import { nanoid } from 'nanoid';
import { UserService } from '@/User/Service/UserService';

@Injectable()
export class RoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  public async create(hostId: string): Promise<RoomDto> {
    const room = await this.prisma.room.create({
      data: {
        hostId: hostId,
        participants: [],
        code: nanoid(5),
      },
    });
    const host = await this.userService.getDtoById(hostId);
    return new RoomDto(room.id, room.code, host, []);
  }

  public async join(code: string, userId: string): Promise<RoomDto> {
    const room = await this.prisma.room.findUnique({
      where: {
        code: code,
      },
    });
    const updatedRoom = await this.prisma.room.update({
      where: {
        code: code,
      },
      data: {
        participants: [...room!.participants, userId],
      },
    });
    const host = await this.userService.getDtoById(updatedRoom.hostId);
    const participants = await Promise.all(
      updatedRoom.participants.map((p) => this.userService.getDtoById(p)),
    );
    return new RoomDto(updatedRoom.id, updatedRoom.code, host, participants);
  }

  public async delete(roomId: number, userId: string) {
    const room = await this.prisma.room.delete({
      where: {
        id: roomId,
        hostId: userId,
      },
    });

    if (!room) throw NotFoundException;
  }
}
