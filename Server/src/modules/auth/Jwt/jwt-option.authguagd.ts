import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err | info) {
      return null;
    }
    return user;
  }
}
