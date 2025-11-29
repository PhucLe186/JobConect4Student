import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import type { Request } from 'express';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}
<<<<<<< HEAD
  
=======

>>>>>>> 165a7464 (new updat 29/11/2025)
  @UseGuards(JwtAuthGuard)
  @Post('')
  async ApplyJob(@Body('id') job_id: string, @Req() req: Request) {
    return this.applicationsService.applyJobs(job_id, req.user as JwtUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async testAuth(@Req() req: Request) {
    return { message: 'Auth working', user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getApplicationHistory(@Req() req: Request) {
    return this.applicationsService.getApplicationHistory(req.user as JwtUser);
  }
}
