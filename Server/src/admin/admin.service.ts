import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { AdminLoginDto } from './dto/admin-login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async validateAdmin(loginDto: AdminLoginDto): Promise<any | null> {
    // Test với hardcoded admin
    if (loginDto.username === 'admin' && loginDto.password === 'admin123') {
      return {
        _id: '123',
        username: 'admin',
        role: 'super_admin'
      };
    }
    return null;
  }

  async getDashboardStats() {
    return {
      totalUsers: 150,
      totalJobs: 75,
      totalApplications: 320,
      activeEmployers: 45
    };
  }

  async getAllUsers() {
    return [];
  }

  async getAllJobs() {
    return [];
  }

  async getAllForumPosts() {
    return [];
  }

  async logout() {
    return {
      success: true,
      message: 'Đăng xuất thành công'
    };
  }
}
