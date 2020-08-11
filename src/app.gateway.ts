import {
  WebSocketGateway,
  SubscribeMessage,
  WsResponse,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { SocketAuthGuard } from './common/guards/socket-auth.guard';
import { UseGuards, OnModuleInit } from '@nestjs/common';
import { User } from './user/models/user.entity';

interface AuthWSResponse {
  success: boolean;
}

interface AuthWSRequest {
  user: User;
  token: string;
}

@WebSocketGateway()
export class AppGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  static staticServer: Server;

  onModuleInit(): void {
    AppGateway.staticServer = this.server;
  }

  @SubscribeMessage('auth')
  @UseGuards(SocketAuthGuard)
  auth(client: Socket, { user }: AuthWSRequest): WsResponse<AuthWSResponse> {
    client.join(user.id.toString());
    return { event: 'auth', data: { success: true } };
  }
}
