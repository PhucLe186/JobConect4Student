import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Jobs, JobsDocument } from './jobs.schema';
import { Model } from 'mongoose';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Jobs.name) private JobsModel: Model<JobsDocument>) {}

  async getJob(): Promise<Jobs[]> {
    const jobs = await this.JobsModel.find(
      {},
      {
        company_name: 1,
        industry: 1,
        size: 1,
        logo: 1,
      },
    );

    return jobs;
  }
}
