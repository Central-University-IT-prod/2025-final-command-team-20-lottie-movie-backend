import { Injectable } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { ConfigService } from '@nestjs/config';
import { EnvValidationScheme } from '@/EnvValidationScheme';

@Injectable()
export class CacheService {
  private readonly client: RedisClientType;

  public keys = {
    userToken: (userId: string) => `user_token:${userId}`,
    reelViews: (userId: string, filmId: number) => `reel_views:${userId}:${filmId}`,
  };

  constructor(configService: ConfigService<EnvValidationScheme>) {
    this.client = createClient({
      url: configService.get<string>('REDIS_URL'),
    });

    this.client.connect();
  }

  public async set(key: string, value: string, ttl?: number): Promise<void> {
    await this.client.set(key, value, {
      EX: ttl,
    });
  }

  public async setWithUTC(key: string, value: string, expiresAt: Date): Promise<void> {
    const unixTimestamp = Math.floor(expiresAt.getTime() / 1000);

    await this.client.set(key, value, {
      EXAT: unixTimestamp,
    });
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async shutdown(): Promise<void> {
    await this.client.disconnect();
  }

  public async increment(key: string): Promise<number> {
    return this.client.incr(key);
  }
}
