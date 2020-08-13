import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from '../message/models/message.entity';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { Chat } from './models/chat.entity';
import { User } from '../user/models/user.entity';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Chat, User]),
    SocketModule,
  ],
  providers: [ChatService, ChatResolver],
  exports: [ChatService],
})
export class ChatModule {}
