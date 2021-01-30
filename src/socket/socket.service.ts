import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { GetMessageOutput } from 'src/message/dto/get-message.output';

@Injectable()
export class SocketService {
  private _server: Server;

  public initServer(server: Server) {
    this._server = server;
  }

  public clientAlive(rid: string): boolean {
    return this._server.sockets.adapter.rooms[rid] && true;
  }

  public incomingMessage(rid: string, message: GetMessageOutput): void {
    this._server.to(rid).emit('inc_msg', { message });
  }
}
