import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Jobs, JobsDocument } from './schema/jobs.schema';
import { Model, Types } from 'mongoose';
import { JobsDto } from './dto/JobDto.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import {
  ApplyJobDocument,
  job_applications,
} from '../applications/applyjob.schema';
import { CSV, ResumeDocument } from '../resume/resume.schema';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { CreateJobDto } from './dto/CreateJob.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  async Jobs(): Promise<JobsDto[]> {
    const jobs = await this.jobsModel
      .find()
      .select('title employer_id')
      .populate({
        path: 'Employer',
        select: 'company_name logo',
      })
      .lean()
      .exec();
    const flattenedJobs = jobs.map((job) => {
      const employer = (job as any).Employer;
      return {
        id: job._id.toString(),
        title: job.title,
        company_name: employer.company_name || '',
        logo: employer.logo || '',
      };
    });
    return flattenedJobs;
  }
  async detailJob(id: string): Promise<any> {
    const detailJob = await this.jobsModel
      .findById({ _id: id })
      .populate({
        path: 'Employer',
        select: 'company_name logo -_id -user_id',
        populate: {
          path: 'User',
          select: 'name email -_id',
        },
      })
      .lean()
      .exec();

    const employer = (detailJob as any).Employer;
    const User = employer.User;
    const result = {
      ...detailJob,
      ...employer,
      ...User,
    };
    delete result.Employer;
    delete result.User;
    return result;
  }

  async CreateJob(
    user: JwtUser,
    createJobdto: CreateJobDto,
  ): Promise<{ status: any }> {
    const { userId } = user;
    await this.jobsModel.create({
      ...createJobdto,
      employer_id: new Types.ObjectId(userId),
    });
    return { status: true };
  }
}
