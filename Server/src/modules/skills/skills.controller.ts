import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import type { Request } from 'express';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  async getAllSkills() {
    return this.skillsService.getAllSkills();
  }

  @UseGuards(JwtAuthGuard)
  @Get('student')
  async getStudentSkills(@Req() req: Request) {
    return this.skillsService.getStudentSkills(req.user as JwtUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post('student')
  async addStudentSkill(
    @Body() body: { skillId: string; level: number },
    @Req() req: Request
  ) {
    const { skillId, level } = body;
    return this.skillsService.addStudentSkill(req.user as JwtUser, skillId, level);
  }

  @UseGuards(JwtAuthGuard)
  @Post('student/bulk')
  async addMultipleStudentSkills(
    @Body() body: { skills: { skillId: string; level: number }[] },
    @Req() req: Request
  ) {
    const { skills } = body;
    return this.skillsService.addMultipleStudentSkills(req.user as JwtUser, skills);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('student/:skillId')
  async removeStudentSkill(
    @Param('skillId') skillId: string,
    @Req() req: Request
  ) {
    return this.skillsService.removeStudentSkill(req.user as JwtUser, skillId);
  }
}
