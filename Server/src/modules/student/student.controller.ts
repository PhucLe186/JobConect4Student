import { Controller, Get, Put, Req, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { StudentService } from './student.service';
import type { Request } from 'express';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';

@Controller('student')
export class StudentController {
  constructor(private readonly StudentService: StudentService) { }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async Student(@Req() req: Request) {
    return this.StudentService.getStudentbyID(req.user as JwtUser);
  }

  @UseGuards(JwtAuthGuard)
  @Put('')
  async updateStudent(@Req() req: Request, @Body() updateData: any) {
    try {
      return await this.StudentService.updateStudent(req.user as JwtUser, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


}
