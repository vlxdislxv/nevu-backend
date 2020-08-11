import { MessageService } from './message.service';
import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './models/message.entity';
import { Chat } from '../chat/models/chat.entity';
import { User } from '../user/models/user.entity';
import { SocketModule } from '../socket/socket.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    SocketModule,
    ChatModule,
    TypeOrmModule.forFeature([Message, Chat, User]),
  ],
  providers: [MessageService, MessageResolver],
})
export class MessageModule {}
