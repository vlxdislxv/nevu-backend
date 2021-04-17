import { Global, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { GqlConfig } from './core/gql/gql-config';
import { SocketStore } from './core/socket/socket.store';
import { SubscriptionService } from './subscription.service';

@Global()
@Module({
  imports: [UserModule],
  providers: [SubscriptionService, GqlConfig, SocketStore],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
