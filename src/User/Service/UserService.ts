import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/Prisma/PrismaService';
import { User } from '@prisma/client';
import { CreateUserDto } from '@/User/Service/Dto/CreateUserDto';
import { UserDto } from '@/User/Service/Dto/UserDto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly prisma: PrismaService) {}

  public async upsert(dto: CreateUserDto): Promise<User> {
    this.logger.verbose(`Upserting user with id ${dto.id}`);
    return this.prisma.user.upsert({
      where: { id: dto.id },
      update: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        username: dto.username,
      },
      create: {
        id: dto.id,
        firstName: dto.firstName ?? undefined,
        lastName: dto.lastName,
        username: dto.username,
        target: {
          countries: {},
          genres: {},
          years: {},
        },
      },
    });
  }

  public async getDtoById(id: string): Promise<UserDto> {
    const user = await this.find(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return UserDto.fromModel(user);
  }

  public async find(id: User['id']): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }
}
