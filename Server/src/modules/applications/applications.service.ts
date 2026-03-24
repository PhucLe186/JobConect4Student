import { Injectable } from '@nestjs/common';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ApplyJobDocument, job_applications } from './applyjob.schema';
import { Model, Types } from 'mongoose';
import { CSV, ResumeDocument } from '../resume/resume.schema';
import { Student, StudentDocument } from '../student/student.schema';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { Jobs, JobsDocument } from '../jobs/schema/jobs.schema';
import { Employer, EmployerDocument } from '../employer/employer.schema';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(job_applications.name)
    private jobApplyModel: Model<ApplyJobDocument>,
    @InjectModel(CSV.name) private CVModel: Model<ResumeDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
  ) {}

  private async getApplicantProfile(userId: string) {
    const [userInfo, studentInfo] = await Promise.all([
      this.userModel.findById(userId).lean(),
      this.studentModel.findOne({ user_id: new Types.ObjectId(userId) }).lean(),
    ]);

    if (!userInfo) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }

    return {
      fullName: userInfo.name || 'Chưa cập nhật',
      email: userInfo.email || 'Chưa cập nhật',
      phone: studentInfo?.phone || 'Chưa cập nhật',
    };
  }

  private async ensureNotApplied(jobId: string, userId: string) {
    const existingApplication = await this.jobApplyModel.findOne({
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
    });

    if (existingApplication) {
      throw new Error('Bạn đã ứng tuyển vị trí này rồi!');
    }
  }

  async applyJobs(
    jobid: string,
    user: JwtUser,
    options?: { cvFile?: Express.Multer.File; coverLetter?: string },
  ): Promise<{ status: string }> {
    const { userId } = user;
    const { cvFile, coverLetter } = options || {};

    await this.ensureNotApplied(jobid, userId);
    const applicantProfile = await this.getApplicantProfile(userId);

    if (cvFile) {
      await this.jobApplyModel.create({
        job_id: new Types.ObjectId(jobid),
        student_id: new Types.ObjectId(userId),
        cv_file_path: cvFile.path,
        full_name: applicantProfile.fullName,
        email: applicantProfile.email,
        phone: applicantProfile.phone,
        cover_letter: coverLetter || '',
        applied_at: new Date(),
      });

      return { status: 'Ứng tuyển thành công!' };
    }

    const cv = await this.CVModel.findOne({
      student_id: new Types.ObjectId(userId),
    });

    if (!cv) {
      throw new Error('Vui lòng tải CV lên hoặc tạo CV trước khi ứng tuyển');
    }

    await this.jobApplyModel.create({
      job_id: new Types.ObjectId(jobid),
      student_id: new Types.ObjectId(userId),
      cv_id: (cv as any)._id,
      full_name: applicantProfile.fullName,
      email: applicantProfile.email,
      phone: applicantProfile.phone,
      cover_letter: coverLetter || '',
      applied_at: new Date(),
    });
    return { status: 'Ứng tuyển thành công!' };
  }

  async applyWithDetails(
    applicationData: {
      jobId: string;
      fullName: string;
      email: string;
      phone: string;
      coverLetter?: string;
    },
    cvFile: Express.Multer.File,
    user: JwtUser
  ): Promise<{ status: string }> {
    const { userId } = user;
    const { jobId, fullName, email, phone, coverLetter } = applicationData;
    const applicantProfile = await this.getApplicantProfile(userId);

    await this.ensureNotApplied(jobId, userId);

    if (!cvFile) {
      throw new Error('Vui lòng tải lên CV trước khi ứng tuyển');
    }

    await this.jobApplyModel.create({
      job_id: new Types.ObjectId(jobId),
      student_id: new Types.ObjectId(userId),
      cv_file_path: cvFile.path,
      full_name: fullName || applicantProfile.fullName,
      email: email || applicantProfile.email,
      phone: phone || applicantProfile.phone,
      cover_letter: coverLetter || '',
      applied_at: new Date(),
    });

    return { status: 'Ứng tuyển thành công!' };
  }

  async getApplicationHistory(user: JwtUser) {
    const { userId } = user;

    // Lấy thông tin user và student
    const userInfo = await this.userModel.findById(userId);
    const studentInfo = await this.studentModel.findOne({ user_id: new Types.ObjectId(userId) });

    // Lấy lịch sử ứng tuyển với populate thông tin job và employer
    const applications = await this.jobApplyModel
      .find({ student_id: new Types.ObjectId(userId) })
      .populate({
        path: 'job_id',
        model: 'Jobs',
        populate: {
          path: 'employer_id',
          model: 'Employer',
          select: 'company_name logo'
        }
      })
      .populate('cv_id')
      .sort({ applied_at: -1 });

    return {
      personalInfo: {
        name: userInfo?.name,
        email: userInfo?.email,
        dateOfBirth: userInfo?.dateOfbirth,
        gender: userInfo?.gender,
        phone: studentInfo?.phone,
        address: studentInfo?.address,
        avatar: studentInfo?.avatar,
        school: studentInfo?.school,
        major: studentInfo?.major,
        gpa: studentInfo?.gpa,
        graduation_year: studentInfo?.graduation_year,
        career_goal: studentInfo?.career_goal,
        desired_salary: studentInfo?.desired_salary
      },
      applications: applications.map(app => ({
        id: app._id,
        jobTitle: (app.job_id as any)?.title || 'N/A',
        companyName: (app.job_id as any)?.employer_id?.company_name || 'N/A',
        companyLogo: (app.job_id as any)?.employer_id?.logo,
        status: app.status,
        applied_at: app.applied_at,
        cv: app.cv_id,
        cv_file_path: app.cv_file_path,
        full_name: app.full_name,
        email: app.email,
        phone: app.phone,
        cover_letter: app.cover_letter
      }))
    };
  }
}
