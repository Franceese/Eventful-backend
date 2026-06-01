import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  private jwt = new NestJwtService({
    secret: 'eventful_secret_key',
    signOptions: { expiresIn: '1d' },
  });

  generateToken(payload: any) {
    return this.jwt.sign(payload);
  }

  verifyToken(token: string) {
    return this.jwt.verify(token);
  }
}