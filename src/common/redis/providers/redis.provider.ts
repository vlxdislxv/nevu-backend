import { FactoryProvider } from '@nestjs/common';
import * as Redis from 'ioredis';
import { ConfigService } from '../../../config/config.service';

export const RedisProvider: FactoryProvider = {
  provide: 'Redis',
  useFactory(configService: ConfigService) {
    return new Redis({
      host: configService.get('REDIS_HOST'),
      port: +configService.get('REDIS_PORT'),
    });
  },
  inject: [ConfigService],
};
