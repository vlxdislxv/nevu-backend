import { Global, Module } from '@nestjs/common';
import { HashHelper } from './helpers/hash.helper';

@Global()
@Module({
  providers: [HashHelper],
  exports: [HashHelper],
})
export class CommonModule {}
