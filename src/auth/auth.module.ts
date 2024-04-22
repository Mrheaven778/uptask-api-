import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule, JwtModule],
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        // que espire en 6 meses
        signOptions: { expiresIn: '182d' },
      }),
    }),],

  // JwtModule.register({
  //   secret: process.env.JWT_SECRET,
  //   signOptions: { expiresIn: '2h' },
  // })], 
})
export class AuthModule { }
