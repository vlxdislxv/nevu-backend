import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketAuthGuard } from './common/guards/socket-auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthWSRequest } from './common/guards/interfaces';

@WebSocketGateway()
export class AppGateway {
  @SubscribeMessage('auth')
  @UseGuards(SocketAuthGuard)
  auth(client: Socket, { user }: AuthWSRequest) {
    client.join(user.id.toString());
    return { event: 'auth', data: { success: true } };
  }
}
