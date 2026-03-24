import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Jobs, JobsDocument } from './schema/jobs.schema';
import { Model, Types } from 'mongoose';
import { JobsDto } from './dto/JobDto.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { CreateJobDto } from './dto/CreateJob.dto';
import { Student, StudentDocument } from '../student/student.schema';
import { StudentSkills, StudentSkillDocument } from '../skills/schema/StudentSkill.schema';
import { Skills, SkillDocument } from '../skills/schema/skills.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(StudentSkills.name) private studentSkillModel: Model<StudentSkillDocument>,
    @InjectModel(Skills.name) private skillModel: Model<SkillDocument>,
  ) {}

  async Jobs(): Promise<JobsDto[]> {
    const jobs = await this.jobsModel
      .find()
      .select(
        'title description employer_id job_type min_salary max_salary location deadline industry experience requirements level status',
      )
      .populate({
        path: 'Employer',
        select: 'company_name logo',
      })
      .lean()
      .exec();
    return jobs.map((job) => {
      const employer = (job as any).Employer;
      return {
        id: job._id.toString(),
        title: job.title,
        company_name: employer?.company_name || '',
        logo: employer?.logo || '',
        employer_id: job.employer_id?.toString?.() || '',
        description: job.description,
        job_type: job.job_type,
        min_salary: job.min_salary,
        max_salary: job.max_salary,
        location: job.location,
        deadline: job.deadline,
        industry: job.industry,
        experience: job.experience,
        requirements: job.requirements,
        level: job.level,
        status: job.status,
      };
    });
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
    if (!detailJob) {
      return null;
    }

    const employer = (detailJob as any).Employer;
    return {
      ...detailJob,
      id: detailJob._id?.toString?.() || id,
      employer_id: detailJob.employer_id?.toString?.() || '',
      company_name: employer?.company_name || '',
      logo: employer?.logo || '',
      email: employer?.User?.email || '',
      employer_name: employer?.User?.name || '',
    };
  }

  async CreateJob(user: JwtUser, createJobdto: CreateJobDto): Promise<{ status: any }> {
    const { userId } = user;
    await this.jobsModel.create({
      ...createJobdto,
      employer_id: new Types.ObjectId(userId),
    });
    return { status: true };
  }

  async suggestedJobs(user: JwtUser): Promise<JobsDto[]> {
    const { userId } = user;

    const student = await this.studentModel.findOne({ user_id: new Types.ObjectId(userId) });
    if (!student) return this.Jobs();

    const studentSkills = await this.studentSkillModel
      .find({ student_id: student._id })
      .populate('skill_id', 'name')
      .lean();

    if (studentSkills.length === 0) return this.Jobs();

    const skillNames = studentSkills
      .map((s: any) => s.skill_id?.name?.toLowerCase())
      .filter(Boolean);

    const allJobs = await this.jobsModel
      .find()
      .select('title employer_id industry')
      .populate({ path: 'Employer', select: 'company_name logo' })
      .lean();

    const matched = allJobs.filter((job) => {
      const industry = (job.industry || '').toLowerCase();
      const title = (job.title || '').toLowerCase();
      return skillNames.some((skill) => industry.includes(skill) || title.includes(skill));
    });

    const source = matched.length > 0 ? matched : allJobs;
    return source.map((job) => {
      const employer = (job as any).Employer;
      return {
        id: job._id.toString(),
        title: job.title,
        company_name: employer?.company_name || '',
        logo: employer?.logo || '',
      };
    });
  }
}
