import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  public server: Server;

  public clientAlive(rid: string): boolean {
    return this.server.sockets.adapter.rooms[rid] && true;
  }
}
