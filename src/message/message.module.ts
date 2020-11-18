import { MessageService } from './message.service';
import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './db/message.entity';
import { Chat } from '../chat/db/chat.entity';
import { User } from '../user/db/user.entity';
import { SocketModule } from '../socket/socket.module';
import { ChatModule } from '../chat/chat.module';
import { MessageRepositoryProvider } from './db/message.repository';

@Module({
  imports: [
    SocketModule,
    ChatModule,
    TypeOrmModule.forFeature([Message, Chat, User]),
  ],
  providers: [MessageService, MessageResolver, MessageRepositoryProvider],
  exports: [MessageRepositoryProvider],
})
export class MessageModule {}
