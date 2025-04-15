import { UserDto } from '@/User/Service/Dto/UserDto';

export class RoomDto {
  id: number;
  code: string;
  host: UserDto;
  participants: UserDto[];

  constructor(id: number, code: string, host: UserDto, participants: UserDto[]) {
    this.id = id;
    this.code = code;
    this.host = host;
    this.participants = participants;
  }
}
