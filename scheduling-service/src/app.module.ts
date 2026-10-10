import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './guard/auth.module.js';
import { GqlAuthGuard } from './guard/gql-auth.guard.js';
import { Request } from 'express';
import { CustomerModule } from './customer/customer.module.js';
import { DoctorModule } from './doctor/doctor.module.js';
import { ScheduleModule } from './schedule/schedule.module.js';

@Module({
  imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    AuthModule,
    CustomerModule,
    DoctorModule,
    ScheduleModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
  ],
})
export class AppModule {}
