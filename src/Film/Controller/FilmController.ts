import { Body, Controller, Post } from '@nestjs/common';
import { FilmService } from '@/Film/Service/FilmService';
import { FilmDto } from '@/Film/Service/Dto/FilmDto';
import { SearchFilmDto } from '@/Film/Service/Dto/SearchFilmDto';
import { ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@Controller('/films')
export class FilmController {
  constructor(private readonly filmService: FilmService) {}

  @ApiOperation({ summary: 'Search films' })
  @ApiResponse({ status: 200, type: [FilmDto] })
  @Post('/search')
  async search(@Body() dto: SearchFilmDto): Promise<FilmDto[]> {
    return await this.filmService.searchFilms(dto.value);
  }
}
