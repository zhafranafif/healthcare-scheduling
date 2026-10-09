import { Module } from '@nestjs/common';
import { AuthClient } from './auth.client.js';
import { GqlAuthGuard } from './gql-auth.guard.js';

@Module({
  providers: [AuthClient, GqlAuthGuard],
  exports: [AuthClient, GqlAuthGuard],
})
export class AuthModule {}
