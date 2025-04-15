import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { MatchService } from '../Service/MatchService';
import { JwtAccessGuard } from '@/Auth/JwtAccessGuard';
import { CurrentUser } from '@/Auth/CurrentUserDecorator';
import { User } from '@prisma/client';
import { UserTarget } from '../Service/Types/UserTarget';
import { NoteResponseDto } from '@/Notes/Service/Dto/NoteResponseDto';

@Controller('match')
@ApiBearerAuth('jwt-access')
@UseGuards(JwtAccessGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('find')
  @ApiOperation({ summary: 'Find matching notes for the current user' })
  @ApiOkResponse({
    description: 'Returns an array of NoteResponseDto objects representing the matching notes',
    type: NoteResponseDto,
  })
  async findMatch(@CurrentUser() user: User): Promise<NoteResponseDto> {
    const notes = await this.matchService.findMatchingNotes(user.id, user.target as UserTarget);
    return notes[0];
  }
}
