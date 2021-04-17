import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { UserService } from '../user/user.service';
import { SocketModel } from './core/socket/socket.model';
import { SocketStore } from './core/socket/socket.store';
import { CstWebSocket } from './core/socket/types';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject('Redis')
    private readonly redis: Redis,
    private readonly socketStore: SocketStore,
    private readonly userService: UserService,
  ) {
    this.redis.flushall();
  }

  public async onConnect({ token }: any, websocket: CstWebSocket) {
    const { id } = await this.userService.fromToken(token);
    const socket = new SocketModel(websocket, id);

    this.socketStore.add(socket);

    this.redis.set(`sid:${socket.id}`, id);
    this.redis.sadd(`uid:${id}`, socket.id);

    return { uid: id };
  }

  public async onDisconnect({ id }: CstWebSocket) {
    this.socketStore.drop(id);

    const uid = await this.redis.get(`sid:${id}`);

    if (uid) {
      this.redis.srem(`uid:${uid}`, id);
      this.redis.del(`sid:${id}`);
    }
  }

  public isOnline(uid: number): Promise<boolean> {
    return new Promise((resolve) => {
      this.redis.smembers(`uid:${uid}`, (err: Error, res: string[]) => {
        if (err) throw err;

        resolve(res.length > 0);
      });
    });
  }
}
