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
import { SocketService } from './socket/socket.service';

interface AuthWSResponse {
  success: boolean;
}

interface AuthWSRequest {
  user: User;
  token: string;
}

@WebSocketGateway()
export class AppGateway implements OnModuleInit {
  constructor(private socketService: SocketService) {}

  @WebSocketServer()
  public server: Server;

  onModuleInit(): void {
    this.socketService.server = this.server;
  }

  @SubscribeMessage('auth')
  @UseGuards(SocketAuthGuard)
  auth(client: Socket, { user }: AuthWSRequest): WsResponse<AuthWSResponse> {
    client.join(user.id.toString());
    return { event: 'auth', data: { success: true } };
  }
}
