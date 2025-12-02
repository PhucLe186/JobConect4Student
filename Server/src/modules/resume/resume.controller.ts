import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('create')
  async createResume(
    @Body() createResumeDto: CreateResumeDto,
    @Query('studentId') studentId: string
  ) {
    return this.resumeService.createResume(studentId, createResumeDto);
  }

  @Post('save')
  async saveOrUpdateResume(
    @Body() createResumeDto: CreateResumeDto,
    @Query('studentId') studentId: string,
    @Query('resumeId') resumeId?: string
  ) {
    return this.resumeService.saveOrUpdateResume(studentId, createResumeDto, resumeId);
  }

  @Put(':id')
  async updateResume(
    @Param('id') resumeId: string,
    @Body() updateData: Partial<CreateResumeDto>
  ) {
    return this.resumeService.updateResume(resumeId, updateData);
  }

  @Get('student/:studentId')
  async getResumesByStudent(@Param('studentId') studentId: string) {
    return this.resumeService.getResumesByStudent(studentId);
  }

  @Get('list')
  async getAllResumes() {
    return this.resumeService.getAllResumes();
  }

  @Get(':id')
  async getResumeById(@Param('id') resumeId: string) {
    return this.resumeService.getResumeById(resumeId);
  }

  @Delete(':id')
  async deleteResume(@Param('id') resumeId: string) {
    return this.resumeService.deleteResume(resumeId);
  }
}
