// src/auth/jwt-auth.guard.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // Nếu không có user, throw BadRequestException thay vì Unauthorized
    if (!user) {
      throw new BadRequestException('Bạn chưa đăng nhập');
    }
    return user;
  }
}
