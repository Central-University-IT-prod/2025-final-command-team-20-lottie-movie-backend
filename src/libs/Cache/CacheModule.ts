import { Module, OnModuleDestroy } from '@nestjs/common';
import { CacheService } from '@/libs/Cache/CacheService';

@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule implements OnModuleDestroy {
  constructor(private readonly cacheService: CacheService) {}

  async onModuleDestroy(): Promise<void> {
    await this.cacheService.shutdown();
  }
}
