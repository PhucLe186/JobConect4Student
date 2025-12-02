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
import { SkillDocument, Skills } from '../skills/schema/skills.schema';
import { JobSkillDocument, JobSkills } from '../skills/schema/JobSkill.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Skills.name) private SkillModel: Model<SkillDocument>,
    @InjectModel(JobSkills.name) private JobSkillModel: Model<JobSkillDocument>,
  ) {}

  async Jobs(): Promise<JobsDto[]> {
    const jobs = await this.jobsModel
      .find()
      .select('title employer_id job_type')
      .populate({
        path: 'Employer',
        select: 'company_name logo address ',
      })
      .lean()
      .exec();
    const flattenedJobs = jobs.map((job) => {
      const employer = (job as any).Employer;
      return {
        id: job._id.toString(),
        title: job.title,
        job_type: job.job_type,
        company_name: employer.company_name || '',
        logo: employer.logo || '',
        address: employer.address,
      };
    });
    return flattenedJobs;
  }

  async detailJob(id: string): Promise<any> {
    const detailJob = await this.jobsModel
      .findById({ _id: id })
      .populate({
        path: 'Employer',
        select: 'company_name logo phone -_id -user_id',
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
    console.log(detailJob);
    delete result.Employer;
    delete result.User;
    return result;
  }

  async CreateJob(
    user: JwtUser,
    createJobdto: CreateJobDto,
  ): Promise<{ message: string }> {
    const { userId } = user;
    const { skills, ...rest } = createJobdto;
    const job = await this.jobsModel.create({
      ...rest,
      employer_id: new Types.ObjectId(userId),
    });
    console.log(job._id);
    for (let skill of skills) {
      let skillDoc = await this.SkillModel.findOne({
        name: skill?.skill_name,
      });
      if (!skillDoc) {
        skillDoc = await this.SkillModel.create({
          name: skill?.skill_name,
        });
      }
      await this.JobSkillModel.create({
        skill_id: new Types.ObjectId(skillDoc._id),
        Job_id: new Types.ObjectId(job._id),
      });
    }

    return { message: ' đăng tuyển thành công' };
  }
}
