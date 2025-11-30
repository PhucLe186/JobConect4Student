import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { Jobs, JobsDocument } from '../jobs/schema/jobs.schema';
import { job_applications, ApplyJobDocument } from '../applications/applyjob.schema';
import { Forum, ForumDocument } from '../forum/forum.scheme';
import { Message, MessageDocument } from '../comment/message.schema';
import { Employer, EmployerDocument } from '../employer/employer.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Jobs.name) private JobsModel: Model<JobsDocument>,
    @InjectModel(job_applications.name) private ApplicationsModel: Model<ApplyJobDocument>,
    @InjectModel(Forum.name) private ForumModel: Model<ForumDocument>,
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
    @InjectModel(Employer.name) private EmployerModel: Model<EmployerDocument>,
  ) {}

  async getDashboardStats(): Promise<object> {
    const [totalUsers, totalJobs, totalApplications, pendingApplications] = await Promise.all([
      this.UserModel.countDocuments(),
      this.JobsModel.countDocuments(),
      this.ApplicationsModel.countDocuments(),
      this.ApplicationsModel.countDocuments({ status: 'sent' })
    ]);

    return {
      totalUsers,
      totalJobs,
      totalApplications,
      pendingApplications
    };
  }

  async getDashboardForum(): Promise<object> {
    const [totalPosts, totalComments] = await Promise.all([
      this.ForumModel.countDocuments(),
      this.MessageModel.countDocuments()
    ]);

    return {
      totalPosts,
      totalComments
    };
  }

  async getAllUsers(): Promise<object[]> {
    const users = await this.UserModel.find()
      .select('name email role status last_active')
      .lean()
      .exec();
    
    // Cập nhật trạng thái offline nếu không hoạt động trong 5 phút
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    return users.map(user => {
      const isOnline = user.status === 'online' && user.last_active > fiveMinutesAgo;
      return {
        ...user,
        status: isOnline ? 'online' : 'offline'
      };
    });
  }

  async getUserById(id: string): Promise<object | null> {
    const user = await this.UserModel.findById(id)
      .select('name email role dateOfbirth gender email_verified language status last_active')
      .lean()
      .exec();
    
    if (user) {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const isOnline = user.status === 'online' && user.last_active > fiveMinutesAgo;
      user.status = isOnline ? 'online' : 'offline';
    }
    
    return user;
  }

  async updateUser(id: string, updateData: any): Promise<object | null> {
    return this.UserModel.findByIdAndUpdate(id, updateData, { new: true })
      .select('name email role dateOfbirth gender email_verified language')
      .lean()
      .exec();
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    await this.UserModel.findByIdAndDelete(id);
    return { message: 'User deleted successfully' };
  }

  async getAllJobs(): Promise<object[]> {
    const jobs = await this.JobsModel.find()
      .select('title min_salary max_salary employer_id status')
      .lean()
      .exec();
    
    for (const job of jobs) {
      const employer = await this.EmployerModel.findOne({ user_id: job.employer_id })
        .select('company_name')
        .lean()
        .exec();
      job['company_name'] = employer?.company_name || 'N/A';
    }
    
    return jobs;
  }

  async getJobById(id: string): Promise<object | null> {
    const job = await this.JobsModel.findById(id)
      .lean()
      .exec();
    
    if (job) {
      const employer = await this.EmployerModel.findOne({ user_id: job.employer_id })
        .select('company_name')
        .lean()
        .exec();
      job['company_name'] = employer?.company_name || 'N/A';
    }
    
    return job;
  }

  async updateJob(id: string, updateData: any): Promise<object | null> {
    const job = await this.JobsModel.findByIdAndUpdate(id, updateData, { new: true })
      .lean()
      .exec();
    
    if (job) {
      const employer = await this.EmployerModel.findOne({ user_id: job.employer_id })
        .select('company_name')
        .lean()
        .exec();
      job['company_name'] = employer?.company_name || 'N/A';
    }
    
    return job;
  }

  async deleteJob(id: string): Promise<{ message: string }> {
    await this.JobsModel.findByIdAndDelete(id);
    return { message: 'Job deleted successfully' };
  }

  async updateUserStatus(userId: string): Promise<void> {
    await this.UserModel.findByIdAndUpdate(userId, {
      status: 'online',
      last_active: new Date()
    });
  }

  async setUserOffline(userId: string): Promise<void> {
    await this.UserModel.findByIdAndUpdate(userId, {
      status: 'offline'
    });
  }

  async approveJob(id: string): Promise<object | null> {
    return this.updateJob(id, { status: 'open' });
  }

  async rejectJob(id: string): Promise<object | null> {
    return this.updateJob(id, { status: 'close' });
  }

  async getPendingJobs(): Promise<object[]> {
    const jobs = await this.JobsModel.find({ status: 'draft' })
      .select('title min_salary max_salary employer_id status created_at')
      .lean()
      .exec();
    
    for (const job of jobs) {
      const employer = await this.EmployerModel.findOne({ user_id: job.employer_id })
        .select('company_name')
        .lean()
        .exec();
      job['company_name'] = employer?.company_name || 'N/A';
    }
    
    return jobs;
  }
}