import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Jobs, JobsDocument } from './schema/jobs.schema';
import { JobsDto } from './dto/JobDto.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { CreateJobDto } from './dto/CreateJob.dto';
import { Student, StudentDocument } from '../student/student.schema';
import { StudentSkills, StudentSkillDocument } from '../skills/schema/StudentSkill.schema';
import { Skills, SkillDocument } from '../skills/schema/skills.schema';
import { JobSkills, JobSkillDocument } from '../skills/schema/JobSkill.schema';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(StudentSkills.name) private studentSkillModel: Model<StudentSkillDocument>,
    @InjectModel(Skills.name) private skillModel: Model<SkillDocument>,
    @InjectModel(JobSkills.name) private jobSkillModel: Model<JobSkillDocument>,
  ) {}

  private mapJob(job: any): JobsDto {
    const employer = job.Employer;

    return {
      id: job._id?.toString?.() || '',
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
      department: job.department || '',
      experience: job.experience,
      requirements: job.requirements,
      level: job.level,
      status: job.status,
      created_at: job.created_at,
      min_gpa: job.min_gpa || 0,
    };
  }

  async Jobs(): Promise<JobsDto[]> {
    const jobs = await this.jobsModel
      .find({ status: 'open' })  // Chỉ hiển thị job đang mở
      .select(
        'title description employer_id job_type min_salary max_salary location deadline industry department experience requirements level status created_at',
      )
      .populate({ path: 'Employer', select: 'company_name logo' })
      .sort({ created_at: -1 })
      .lean()
      .exec();

    return jobs.map((job) => this.mapJob(job));
  }

  async myJobs(user: JwtUser): Promise<JobsDto[]> {
    const { userId } = user;

    const jobs = await this.jobsModel
      .find({ employer_id: new Types.ObjectId(userId) })
      .select(
        'title description employer_id job_type min_salary max_salary location deadline industry department experience requirements level status created_at',
      )
      .populate({
        path: 'Employer',
        select: 'company_name logo',
      })
      .sort({ created_at: -1 })
      .lean()
      .exec();

    return jobs.map((job) => this.mapJob(job));
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

    const jobSkills = await this.jobSkillModel
      .find({ Job_id: new Types.ObjectId(id) })
      .populate('skill_id', 'name')
      .lean()
      .exec();
    const skillIds = jobSkills.map((js: any) => js.skill_id?._id?.toString?.() || js.skill_id?.toString?.() || '');
    const skillNames = jobSkills.map((js: any) => js.skill_id?.name || '').filter(Boolean);

    const employer = (detailJob as any).Employer;

    return {
      ...detailJob,
      id: detailJob._id?.toString?.() || id,
      employer_id: detailJob.employer_id?.toString?.() || '',
      company_name: employer?.company_name || '',
      logo: employer?.logo || '',
      email: employer?.User?.email || '',
      employer_name: employer?.User?.name || '',
      department: detailJob.department || '',
      skillIds,
      skillNames,
    };
  }

  async CreateJob(
    user: JwtUser,
    createJobdto: CreateJobDto,
    skillIds?: string[],
  ): Promise<{ status: boolean; jobId: string }> {
    const { userId } = user;

    const job = await this.jobsModel.create({
      ...createJobdto,
      employer_id: new Types.ObjectId(userId),
      status: createJobdto.status || 'draft',
      min_gpa: createJobdto.min_gpa ? Number(createJobdto.min_gpa) : 0,
    });

    // Lưu skills vào bảng job_skills nếu có - chỉ insert các skillId tồn tại trong DB
    if (skillIds && skillIds.length > 0) {
      const validIds = skillIds.filter((id) => Types.ObjectId.isValid(id));
      const existingSkills = await this.skillModel
        .find({ _id: { $in: validIds.map((id) => new Types.ObjectId(id)) } })
        .select('_id').lean();
      const existingIdSet = new Set(existingSkills.map((s) => s._id.toString()));
      const docs = validIds
        .filter((id) => existingIdSet.has(id))
        .map((id) => ({ Job_id: job._id, skill_id: new Types.ObjectId(id) }));
      if (docs.length > 0) await this.jobSkillModel.insertMany(docs);
    }

    return { status: true, jobId: job._id.toString() };
  }

  async publishJob(jobId: string, user: JwtUser): Promise<{ status: boolean }> {
    const { userId } = user;
    const job = await this.jobsModel.findOneAndUpdate(
      { _id: new Types.ObjectId(jobId), employer_id: new Types.ObjectId(userId) },
      { status: 'open' },
      { new: true },
    );
    if (!job) throw new Error('Không tìm thấy job hoặc bạn không có quyền');
    return { status: true };
  }

  async UpdateJob(
    jobId: string,
    user: JwtUser,
    updateJobDto: CreateJobDto,
    skillIds?: string[],
  ): Promise<{ status: boolean }> {
    const { userId } = user;

    const updatedJob = await this.jobsModel.findOneAndUpdate(
      { _id: new Types.ObjectId(jobId), employer_id: new Types.ObjectId(userId) },
      {
        $set: {
          ...updateJobDto,
          min_gpa: updateJobDto.min_gpa ? Number(updateJobDto.min_gpa) : 0,
        },
      },
      { new: true },
    );

    if (!updatedJob) {
      throw new Error('Không tìm thấy job hoặc bạn không có quyền chỉnh sửa');
    }

    // Xóa liên kết skill cũ trong JobSkills
    await this.jobSkillModel.deleteMany({ Job_id: updatedJob._id });

    // Lưu skills mới vào JobSkills nếu có
    if (skillIds && skillIds.length > 0) {
      const validIds = skillIds.filter((id) => Types.ObjectId.isValid(id));
      const existingSkills = await this.skillModel
        .find({ _id: { $in: validIds.map((id) => new Types.ObjectId(id)) } })
        .select('_id')
        .lean();
      const existingIdSet = new Set(existingSkills.map((s) => s._id.toString()));
      const docs = validIds
        .filter((id) => existingIdSet.has(id))
        .map((id) => ({ Job_id: updatedJob._id, skill_id: new Types.ObjectId(id) }));
      if (docs.length > 0) await this.jobSkillModel.insertMany(docs);
    }

    return { status: true };
  }

  async deleteJob(jobId: string, user: JwtUser): Promise<{ status: boolean }> {
    const { userId } = user;
    const deletedJob = await this.jobsModel.findOneAndDelete({
      _id: new Types.ObjectId(jobId),
      employer_id: new Types.ObjectId(userId),
    });

    if (!deletedJob) {
      throw new Error('Không tìm thấy job hoặc bạn không có quyền xóa');
    }

    // Xóa liên kết skill trong JobSkills
    await this.jobSkillModel.deleteMany({ Job_id: deletedJob._id });

    return { status: true };
  }

  async suggestedJobs(user: JwtUser): Promise<JobsDto[]> {
    const { userId } = user;

    const student = await this.studentModel.findOne({
      user_id: new Types.ObjectId(userId),
    });

    if (!student) return this.Jobs();

    const studentSkills = await this.studentSkillModel
      .find({ student_id: student._id })
      .populate('skill_id', 'name')
      .lean();

    if (studentSkills.length === 0) return this.Jobs();

    const skillNames = studentSkills
      .map((skill: any) => skill.skill_id?.name?.toLowerCase())
      .filter(Boolean);

    const allJobs = await this.jobsModel
      .find()
      .select(
        'title employer_id industry department min_salary max_salary location job_type experience status created_at',
      )
      .populate({ path: 'Employer', select: 'company_name logo' })
      .sort({ created_at: -1 })
      .lean();

    const matched = allJobs.filter((job) => {
      const industry = (job.industry || '').toLowerCase();
      const department = (job.department || '').toLowerCase();
      const title = (job.title || '').toLowerCase();

      return skillNames.some(
        (skill) =>
          industry.includes(skill) ||
          department.includes(skill) ||
          title.includes(skill),
      );
    });

    const source = matched.length > 0 ? matched : allJobs;
    return source.map((job) => this.mapJob(job));
  }
}
