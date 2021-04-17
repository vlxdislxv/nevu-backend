import { Injectable } from '@nestjs/common';
import { SocketModel } from './socket.model';

@Injectable()
export class SocketStore {
  private _sockets: SocketModel[] = [];

  public add(socketModel: SocketModel): void {
    this._sockets.push(socketModel);
  }

  public drop(id: number): void {
    const ind = this._sockets.findIndex((socket) => socket.id === id);

    if (ind !== -1) {
      this._sockets.splice(ind, 1);
    }
  }
}
