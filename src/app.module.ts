import { MessageModule } from './message/message.module';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/db/user.entity';
import { Env } from './common/env';
import { Message } from './message/db/message.entity';
import { Chat } from './chat/db/chat.entity';
import { ChatModule } from './chat/chat.module';
import { AppGateway } from './app.gateway';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    MessageModule,
    ChatModule,
    UserModule,
    SocketModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Env.DB_HOST,
      port: Env.DB_PORT,
      username: Env.DB_USERNAME,
      password: Env.DB_PASSWORD,
      database: Env.DB_DATABASE,
      synchronize: true,
      entities: [User, Message, Chat],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: './src/schema.gql',
      playground: true,
      debug: true,
      context: ({ request }) => ({ request }),
    }),
  ],
  providers: [AppGateway],
})
export class AppModule {}
