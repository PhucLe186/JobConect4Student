import { Injectable } from '@nestjs/common';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ApplyJobDocument, job_applications } from './applyjob.schema';
import { Model, Types } from 'mongoose';
import { CSV, ResumeDocument } from '../resume/resume.schema';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(job_applications.name)
    private jobApplyModel: Model<ApplyJobDocument>,
    @InjectModel(CSV.name) private CVModel: Model<ResumeDocument>,
  ) {}

  async applyJobs(jobid: string, user: JwtUser): Promise<{ status: string }> {
    const { userId } = user;

    const cv = await this.CVModel.findOne({
      student_id: new Types.ObjectId(userId),
    });
    console.log(cv);

    await this.jobApplyModel.create({
      job_id: jobid,
      student_id: userId,
      cv_id: (cv as any)._id,
      applied_at: new Date(),
    });
    return { status: 'apply thành công' };
  }
}
