import { Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import { AIService } from './AIService';
import { EnvValidationScheme } from '@/EnvValidationScheme';
import { HttpsProxyAgent } from 'https-proxy-agent';

const AIServiceProvider: Provider = {
  provide: AIService,
  useFactory: (configService: ConfigService<EnvValidationScheme>) => {
    const apiKey = configService.get<string>('OPENAI_API_KEY');
    return new AIService(
      new OpenAI({
        apiKey,
        httpAgent: new HttpsProxyAgent(configService.get<string>('OPENAI_PROXY') as string),
      }),
    );
  },
  inject: [ConfigService],
};

@Module({
  providers: [AIServiceProvider],
  exports: [AIServiceProvider],
})
export class AIModule {}
