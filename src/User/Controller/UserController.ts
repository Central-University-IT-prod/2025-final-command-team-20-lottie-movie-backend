import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '@/User/Service/UserService';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAccessGuard } from '@/Auth/JwtAccessGuard';
import { UserResponseDto } from '../Service/Dto/UserResponseDto';
import { CurrentUser } from '@/Auth/CurrentUserDecorator';
import { User } from '@prisma/client';

@Controller({ path: 'user' })
@ApiBearerAuth('jwt-access')
@UseGuards(JwtAccessGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/current')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user',
    type: UserResponseDto,
  })
  async getCurrentUser(@CurrentUser() user: User): Promise<UserResponseDto> {
    return UserResponseDto.fromModel(user);
  }
}
