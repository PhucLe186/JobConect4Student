import { Controller, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    return this.dashboardService.getDashboardStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('forum')
  async getForumStats() {
    return this.dashboardService.getDashboardForum();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getAllUsers() {
    return this.dashboardService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.dashboardService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    return this.dashboardService.updateUser(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.dashboardService.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jobs')
  async getAllJobs() {
    return this.dashboardService.getAllJobs();
  }

  @UseGuards(JwtAuthGuard)
  @Get('jobs/:id')
  async getJobById(@Param('id') id: string) {
    return this.dashboardService.getJobById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('jobs/:id')
  async updateJob(@Param('id') id: string, @Body() updateData: any) {
    return this.dashboardService.updateJob(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('jobs/:id')
  async deleteJob(@Param('id') id: string) {
    return this.dashboardService.deleteJob(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('jobs/pending')
  async getPendingJobs() {
    return this.dashboardService.getPendingJobs();
  }

  @UseGuards(JwtAuthGuard)
  @Put('jobs/:id/approve')
  async approveJob(@Param('id') id: string) {
    return this.dashboardService.approveJob(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('jobs/:id/reject')
  async rejectJob(@Param('id') id: string) {
    return this.dashboardService.rejectJob(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id/online')
  async setUserOnline(@Param('id') id: string) {
    await this.dashboardService.updateUserStatus(id);
    return { message: 'User status updated to online' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('users/:id/offline')
  async setUserOffline(@Param('id') id: string) {
    await this.dashboardService.setUserOffline(id);
    return { message: 'User status updated to offline' };
  }
}