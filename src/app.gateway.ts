import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketAuthGuard } from './common/guards/socket-auth.guard';
import { OnModuleInit, UseGuards } from '@nestjs/common';
import { AuthWSRequest } from './common/guards/interfaces';
import { SocketService } from './socket/socket.service';

@WebSocketGateway()
export class AppGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly socketService: SocketService) {}

  onModuleInit() {
    this.socketService.initServer(this.server);
  }

  @SubscribeMessage('auth')
  @UseGuards(SocketAuthGuard)
  auth(client: Socket, { user }: AuthWSRequest) {
    client.join(user.id.toString());
    return { event: 'auth', data: { success: true } };
  }
}
