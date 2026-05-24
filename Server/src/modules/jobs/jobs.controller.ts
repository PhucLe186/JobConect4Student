import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Put,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { CreateJobDto } from './dto/CreateJob.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('')
  async Jobs() {
    return this.jobsService.Jobs();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-jobs')
  async MyJobs(@Req() req: Request) {
    return this.jobsService.myJobs(req.user as JwtUser);
  }

  @Get(':id')
  async DetailJob(@Param('id') id: string) {
    return this.jobsService.detailJob(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async CreateJob(
    @Req() req: Request,
    @Body() body: CreateJobDto & { skillIds?: string[] },
  ) {
    const { skillIds, ...createJobdto } = body;
    return this.jobsService.CreateJob(req.user as JwtUser, createJobdto, skillIds);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/publish')
  async PublishJob(@Param('id') id: string, @Req() req: Request) {
    return this.jobsService.publishJob(id, req.user as JwtUser);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async UpdateJob(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() body: CreateJobDto & { skillIds?: string[] },
  ) {
    const { skillIds, ...updateJobDto } = body;
    return this.jobsService.UpdateJob(id, req.user as JwtUser, updateJobDto, skillIds);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async DeleteJob(@Param('id') id: string, @Req() req: Request) {
    return this.jobsService.deleteJob(id, req.user as JwtUser);
  }
}
