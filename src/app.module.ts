import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
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
      autoSchemaFile: 'schema.gql',
      playground: true,
      debug: true,
      context: ({ request }) => ({ request }),
    }),
    MessageModule,
    ChatModule,
    UserModule,
  ],
})
export class AppModule {}
