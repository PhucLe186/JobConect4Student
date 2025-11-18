import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  gethello() {
    return 'users12345';
  }
}
