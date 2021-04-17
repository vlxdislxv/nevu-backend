import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { CommonModule } from './common/module/common.module';
import { RedisModule } from './common/redis/redis.module';
import { ConfigModule } from './config/config.module';
import { TypeOrmConfigService } from './config/typeorm/typeorm-config.service';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { GqlConfig } from './subscription/core/gql/gql-config';

@Module({
  imports: [
    CommonModule,
    RedisModule,
    ConfigModule.register({ folder: 'config' }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    GraphQLModule.forRootAsync({
      useClass: GqlConfig,
    }),
    MessageModule,
    ChatModule,
    UserModule,
    SubscriptionModule,
  ],
})
export class AppModule {}
