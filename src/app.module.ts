import { MessageModule } from './message/message.module';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { AppGateway } from './app.gateway';
import { SocketModule } from './socket/socket.module';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/module/common.module';
import { TypeOrmConfigService } from './config/typeorm/typeorm-config.service';

@Module({
  imports: [
    CommonModule,
    ConfigModule.register({ folder: 'config' }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: './src/schema.gql',
      playground: true,
      debug: true,
      context: ({ request }) => ({ request }),
    }),
    MessageModule,
    ChatModule,
    UserModule,
    SocketModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
