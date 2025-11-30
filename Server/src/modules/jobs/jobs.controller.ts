import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';
import type { Request } from 'express';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { CreateJobDto } from './dto/CreateJob.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('')
  async Jobs() {
    return this.jobsService.Jobs();
  }
  @Get('/:id')
  async DetailJob(@Param('id') id: string) {
    return this.jobsService.detailJob(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('')
  async CreateJob(@Req() req: Request, @Body() createJobdto: CreateJobDto) {
    return this.jobsService.CreateJob(req.user as JwtUser, createJobdto);
  }
}
