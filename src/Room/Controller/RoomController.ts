import { RoomService } from '@/Room/Service/RoomService';
import { Body, Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CurrentUser } from '@/Auth/CurrentUserDecorator';
import { RoomDto } from '@/Room/Service/Dto/RoomDto';
import { User } from '@prisma/client';
import { JoinRoomDto } from '@/Room/Service/Dto/JoinRoomDto';

@Controller('/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  async createRoom(@CurrentUser() user: User): Promise<RoomDto> {
    return await this.roomService.create(user.id);
  }

  @Post('/join')
  async joinRoom(@CurrentUser() user: User, @Body() dto: JoinRoomDto): Promise<RoomDto> {
    return await this.roomService.join(dto.code, user.id);
  }

  @Delete('/:id')
  async deleteRoom(@CurrentUser() user: User, @Param('id', ParseIntPipe) roomId: number) {
    return await this.roomService.delete(roomId, user.id);
  }
}
