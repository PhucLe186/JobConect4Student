import { UserService } from './user.service';
import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get()
  index() {
    const userService = new UserService();
    return userService.gethello();
  }
}
