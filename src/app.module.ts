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

@Module({
  imports: [
    CommonModule,
    RedisModule,
    ConfigModule.register({ folder: 'config' }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      playground: true,
      debug: true,
      installSubscriptionHandlers: true,
      context: ({ req, connection }) =>
        connection ? { req: connection.context } : { req },
    }),
    MessageModule,
    ChatModule,
    UserModule,
  ],
})
export class AppModule {}
