import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() loginDto: AdminLoginDto) {
    const admin = await this.adminService.validateAdmin(loginDto);
    if (!admin) {
      return { success: false, message: 'Invalid credentials' };
    }
    return { success: true, admin: { id: (admin as any)._id, username: admin.username, role: admin.role } };
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('jobs')
  @UseGuards(JwtAuthGuard)
  async getJobs() {
    return this.adminService.getAllJobs();
  }

  @Get('forum')
  @UseGuards(JwtAuthGuard)
  async getForum() {
    return this.adminService.getAllForumPosts();
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    return this.adminService.logout();
  }
}
