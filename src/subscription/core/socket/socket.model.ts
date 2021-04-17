import { CstWebSocket } from './types';

export class SocketModel {
  constructor(
    private readonly _socket: CstWebSocket,
    private readonly _uid: number,
  ) {
    this._socket.id = Date.now();
  }

  get id() {
    return this._socket.id;
  }

  get uid() {
    return this._uid;
  }

  get socket() {
    return this._socket;
  }
}
