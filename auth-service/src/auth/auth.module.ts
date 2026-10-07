
import { Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from "@healthcare-scheduling/database";
import { AuthRepository } from "./repositories/auth.repository.js";
import { AuthResolver } from "./resolvers/auth.resolver.js";
import { AuthService } from './services/auth.service.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';



@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET')!,
            signOptions: { expiresIn: '1h' },
        }),
        inject: [ConfigService],
    }),
  ],
  providers: [AuthRepository, AuthService, AuthResolver],
  exports: [PassportModule],
})
export class AuthModule {}