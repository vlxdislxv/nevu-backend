import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../message/db/message.entity';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { Chat } from './db/chat.entity';
import { User } from '../user/db/user.entity';
import { UserModule } from '../user/user.module';
import { ChatRepositoryProvider } from './db/chat.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Chat, User]),
    UserModule,
  ],
  providers: [ChatService, ChatResolver, ChatRepositoryProvider],
  exports: [ChatService, ChatRepositoryProvider],
})
export class ChatModule {}
