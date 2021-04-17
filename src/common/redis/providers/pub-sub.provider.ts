import { FactoryProvider } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ConfigService } from '../../../config/config.service';

export const PubSubProvider: FactoryProvider = {
  provide: 'RedisPubSub',
  useFactory(configService: ConfigService) {
    return new RedisPubSub({
      connection: {
        host: configService.get('REDIS_HOST'),
        port: +configService.get('REDIS_PORT'),
      },
    });
  },
  inject: [ConfigService],
};
