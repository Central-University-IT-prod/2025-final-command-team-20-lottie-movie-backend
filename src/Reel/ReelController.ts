import { Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '@/Auth/JwtAccessGuard';
import { CurrentUser } from '@/Auth/CurrentUserDecorator';
import { User } from '@prisma/client';
import { ReelService } from './ReelService';
import { ReelsResponseDto } from './Dto/ReelsResponseDto';

@ApiTags('Reel')
@Controller('/reel')
@ApiBearerAuth('jwt-access')
@UseGuards(JwtAccessGuard)
export class ReelController {
  constructor(private readonly reelService: ReelService) {}

  @ApiOperation({ summary: 'Get reels' })
  @ApiResponse({
    status: 200,
    description: 'Reels retrieved successfully.',
    type: ReelsResponseDto,
  })
  @Get()
  async getReels(
    @CurrentUser() user: User,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('startFromId', ParseIntPipe) startFromId?: number,
  ): Promise<ReelsResponseDto> {
    return {
      reels: await this.reelService.getReels(user, {
        limit,
        startFromId,
      }),
    };
  }

  @ApiOperation({ summary: 'Get my reels' })
  @ApiResponse({
    status: 200,
    description: 'My reels retrieved successfully.',
    type: ReelsResponseDto,
  })
  @Get('my')
  async getMyReels(
    @CurrentUser() user: User,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('offset', ParseIntPipe) offset?: number,
  ): Promise<ReelsResponseDto> {
    return {
      reels: await this.reelService.getMyReels(user, limit ?? 10, offset ?? 0),
    };
  }

  @ApiOperation({ summary: 'View reel' })
  @Post(':id/view')
  async viewReel(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.reelService.viewReel(user, id);
  }

  @ApiOperation({ summary: 'Like reel' })
  @Post(':id/like')
  async likeReel(@CurrentUser() user: User, @Param('id', ParseIntPipe) id: number) {
    return this.reelService.likeReel(user, id);
  }
}
