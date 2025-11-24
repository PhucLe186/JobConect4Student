import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { EmployerService } from './employer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import { CreateEmployerDto } from './tdo/employer.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Get('')
  async employer() {
    return this.employerService.employer();
  }

  @Get('/:id')
  async employerdedtail(@Param('id') id: string) {
    return this.employerService.employerDetail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createEmployer(
    @Req() req: Request,
    @Body() createEmployerDto: CreateEmployerDto,
  ) {
    return this.employerService.createEmployer(
      createEmployerDto,
      req.user as JwtUser,
    );
  }
}
