import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../user/core/db/user.repository';
import { VerifyResp } from './interfaces';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToWs().getData();

    try {
      const payload: VerifyResp = this.jwtService.verify(request.token);

      request.user = await this.userRepository.findById(payload.uid);

      return request.user;
    } catch {
      return false;
    }
  }
}
