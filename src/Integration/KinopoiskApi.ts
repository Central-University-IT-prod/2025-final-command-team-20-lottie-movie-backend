import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';
import { KinopoiskFilmDto } from '@/Integration/Dto/KinopoiskFilmDto';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { EnvValidationScheme } from '@/EnvValidationScheme';

@Injectable()
export class KinopoiskApi {
  private axios: AxiosInstance;

  constructor(private readonly configService: ConfigService<EnvValidationScheme>) {
    this.axios = axios.create({
      baseURL: 'https://kinopoiskapiunofficial.tech',
      headers: {
        'X-API-KEY': this.configService.get('KINOPOISK_API'),
      },
    });
  }

  public async searchFilms(searchValue: string): Promise<KinopoiskFilmDto[]> {
    const films = await this.axios.get<{ items: KinopoiskFilmDto[] }>('/api/v2.2/films', {
      params: {
        order: 'RATING',
        type: 'FILM',
        keyword: searchValue,
      },
    });
    return films.data.items.map((f: object) => plainToInstance(KinopoiskFilmDto, f));
  }
}
