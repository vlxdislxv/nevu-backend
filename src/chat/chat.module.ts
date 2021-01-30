import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { UserModule } from '../user/user.module';
import { ChatRepositoryProvider } from './db/chat.repository';

@Module({
  imports: [UserModule],
  providers: [ChatService, ChatResolver, ChatRepositoryProvider],
  exports: [ChatService, ChatRepositoryProvider],
})
export class ChatModule {}
