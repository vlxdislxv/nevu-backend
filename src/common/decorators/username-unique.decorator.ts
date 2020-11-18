import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../user/db/user.repository';

@ValidatorConstraint({ async: true })
@Injectable()
export class UsernameUnique implements ValidatorConstraintInterface {
  constructor(protected readonly userRepository: UserRepository) {}

  public async validate(text: string): Promise<boolean> {
    const user = await this.userRepository.findByUsername(text);

    return !user;
  }

  public defaultMessage(): string {
    return 'This username is already registered.';
  }
}
