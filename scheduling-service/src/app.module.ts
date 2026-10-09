import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './guard/auth.module.js';
import { GqlAuthGuard } from './guard/gql-auth.guard.js';
import { Request } from 'express';
import { CustomerModule } from './customer/customer.module.js';
import { DoctorModule } from './doctor/doctor.module.js';

@Module({
  imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      graphiql: true,
      context: ({ req }: { req: Request }) => ({ req }),
    }),
    AuthModule,
    CustomerModule,
    DoctorModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlAuthGuard,
    },
  ],
})
export class AppModule {}
