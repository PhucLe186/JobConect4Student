import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminSeedService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async createDefaultAdmin() {
    const existingAdmin = await this.adminModel.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const defaultAdmin = new this.adminModel({
        username: 'admin',
        email: 'admin@jobconnect.com',
        password: hashedPassword,
        role: 'super_admin'
      });

      await defaultAdmin.save();
      console.log('Default admin created: username=admin, password=admin123');
    }
  }
}