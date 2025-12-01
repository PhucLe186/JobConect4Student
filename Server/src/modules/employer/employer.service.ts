import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employer, EmployerDocument } from './employer.schema';
import { Model, Types } from 'mongoose';
import { CreateEmployerDto } from './tdo/employer.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { User, UserDocument } from '../auth/schema/auth.schema';

@Injectable()
export class EmployerService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
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

  async InformationEmploy(user: JwtUser): Promise<Employer | any> {
    const { userId } = user;
    console.log(userId);
    const Information = await this.employerModel.findOne({
      user_id: new Types.ObjectId(userId),
    });
    console.log(Information);

    return Information;
  }

  async createEmployer(
    createEmployerDto: Partial<CreateEmployerDto>,
    user: JwtUser,
    url: string | null,
  ): Promise<{ message: string }> {
    const { userId, role } = user;
    if (role !== 'employer') {
      return { message: 'bạn không phải employer' };
    }
    const User = await this.UserModel.findById(userId);
    const updateData = { ...createEmployerDto };
    if (url) {
      updateData.logo = url;
    }
    if (User) {
      await this.employerModel.findOneAndUpdate(
        { user_id: new Types.ObjectId(userId) },
        { $set: { ...updateData } },
        { new: true },
      );
      return { message: 'cập nhật dữ liệu thành công' };
    }

    await this.employerModel.create({
      user_id: new Types.ObjectId(userId),
      logo: url,
      ...createEmployerDto,
    });
    return { message: 'thêm dữ liệu thành công' };
  }
}
