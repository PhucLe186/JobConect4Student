import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { ResumeService } from './resume.service';

@Controller('resume')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Get()
  async getMyResumes(@Req() req: Request) {
    return this.resumeService.getMyResumes(req.user as JwtUser);
  }

  @Post()
  async createResume(@Body() payload: any, @Req() req: Request) {
    return this.resumeService.createResume(payload, req.user as JwtUser);
  }

  @Put(':id')
  async updateResume(
    @Param('id') id: string,
    @Body() payload: any,
    @Req() req: Request,
  ) {
    return this.resumeService.updateResume(id, payload, req.user as JwtUser);
  }

  @Delete(':id')
  async deleteResume(@Param('id') id: string, @Req() req: Request) {
    return this.resumeService.deleteResume(id, req.user as JwtUser);
  }
}
