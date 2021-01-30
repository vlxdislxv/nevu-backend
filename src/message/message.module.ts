import { MessageService } from './message.service';
import { Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { SocketModule } from '../socket/socket.module';
import { ChatModule } from '../chat/chat.module';
import { MessageRepositoryProvider } from './db/message.repository';

@Module({
  imports: [SocketModule, ChatModule],
  providers: [MessageService, MessageResolver, MessageRepositoryProvider],
  exports: [MessageRepositoryProvider],
})
export class MessageModule {}
