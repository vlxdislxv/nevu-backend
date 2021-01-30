import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  @WebSocketServer()
  public server: Server;

  public clientAlive(rid: string): boolean {
    return this.server.sockets.adapter.rooms[rid] && true;
  }
}
