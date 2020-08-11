import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';

export interface VerifyResp {
  uid: number;
  iat: number;
  exp: number;
}

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToWs().getData();

    try {
      const payload: VerifyResp = this.jwtService.verify(request.token);

      request.user = await this.userService.findById(payload.uid);

      return request.user;
    } catch {
      return false;
    }
  }
}
