import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import type { Request } from 'express';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly StudentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async Student(@Req() req: Request) {
    return this.StudentService.getStudentbyID(req.user as JwtUser);
  }
}
