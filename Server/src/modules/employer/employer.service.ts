import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employer, EmployerDocument } from './employer.schema';
import { Model } from 'mongoose';
import { CreateEmployerDto } from './tdo/employer.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';

@Injectable()
export class EmployerService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
  ) {}
  async employer(): Promise<Employer[]> {
    const company = await this.employerModel.find(
      {},
      {
        company_name: 1,
        industry: 1,
        size: 1,
        logo: 1,
      },
    );
    return company;
  }
  async employerDetail(id: string): Promise<Employer | null> {
    const company = await this.employerModel.findById(id).exec();
    return company;
  }

  async createEmployer(
    createEmployerDto: CreateEmployerDto,
    user: JwtUser,
  ): Promise<{ message: string }> {
    console.log(user);
    const { userId, role } = user;
    if (role !== 'employer') {
      return { message: 'bạn không phải employer' };
    }
    const {
      company_name,
      description,
      size,
      industry,
      address,
      website,
      logo,
    } = createEmployerDto;
    await this.employerModel.create({
      user_id: userId,
      company_name,
      description,
      size,
      industry,
      address,
      website,
      logo,
    });

    return { message: 'update thành công' };
  }
}
