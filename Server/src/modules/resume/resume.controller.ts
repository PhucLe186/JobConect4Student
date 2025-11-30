import { Controller, Get, Post, Put, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { ResumeService } from './resume.service';
import type { Request } from 'express';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createResume(@Req() req: Request, @Body() resumeData: any) {
    return this.resumeService.createResume(req.user as JwtUser, resumeData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getMyResumes(@Req() req: Request) {
    return this.resumeService.getResumesByUser(req.user as JwtUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getResumeById(@Param('id') id: string) {
    return this.resumeService.getResumeById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateResume(@Param('id') id: string, @Body() updateData: any) {
    return this.resumeService.updateResume(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteResume(@Param('id') id: string) {
    return this.resumeService.deleteResume(id);
  }

  @Get('public/:id')
  async getPublicResume(@Param('id') id: string) {
    return this.resumeService.getResumeById(id);
  }
}
