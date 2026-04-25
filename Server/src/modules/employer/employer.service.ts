import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employer, EmployerDocument } from './employer.schema';
import { Model, Types } from 'mongoose';
import { CreateEmployerDto } from './tdo/employer.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { User, UserDocument } from '../auth/schema/auth.schema';

const PAGE_1_REAL_BRAND_SEED = 'page1-real-brand-companies';

@Injectable()
export class EmployerService {
  constructor(
    @InjectModel(Employer.name) private employerModel: Model<EmployerDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async employer(): Promise<Employer[]> {
    const companies = await this.employerModel
      .find(
        {},
        {
          company_name: 1,
          description: 1,
          industry: 1,
          size: 1,
          logo: 1,
          address: 1,
          website: 1,
          email: 1,
          user_id: 1,
          seed_source: 1,
        },
      )
      .sort({ _id: -1 })
      .lean()
      .exec();

    const uniqueCompanies: Employer[] = [];
    const seenUsers = new Set<string>();

    for (const company of companies) {
      const userKey = company.user_id.toString();

      if (seenUsers.has(userKey)) {
        continue;
      }

      seenUsers.add(userKey);
      uniqueCompanies.push(company as Employer);
    }

    return uniqueCompanies.sort((firstCompany: any, secondCompany: any) => {
      const firstPriority =
        firstCompany.seed_source === PAGE_1_REAL_BRAND_SEED ? 0 : 1;
      const secondPriority =
        secondCompany.seed_source === PAGE_1_REAL_BRAND_SEED ? 0 : 1;

      if (firstPriority !== secondPriority) {
        return firstPriority - secondPriority;
      }

      return secondCompany._id.toString().localeCompare(firstCompany._id.toString());
    });
  }

  async employerDetail(id: string): Promise<Employer | null> {
    const company = await this.employerModel.findById(id).exec();
    return company;
  }

  async getEmployerProfile(user: JwtUser): Promise<Record<string, unknown>> {
    const { userId, role, email } = user;
    if (role !== 'employer') {
      throw new UnauthorizedException('Bạn không phải nhà tuyển dụng');
    }

    const objectUserId = new Types.ObjectId(userId);
    const [account, employer] = await Promise.all([
      this.userModel.findById(objectUserId).select('email').lean().exec(),
      this.employerModel
        .findOne({ user_id: objectUserId })
        .sort({ _id: -1 })
        .lean()
        .exec(),
    ]);

    return {
      _id: employer?._id ?? null,
      company_name: employer?.company_name || '',
      description: employer?.description || '',
      size: employer?.size ?? null,
      industry: employer?.industry || '',
      address: employer?.address || '',
      email: employer ? employer.email || '' : account?.email || email || '',
      website: employer?.website || '',
      logo: employer?.logo || '',
    };
  }

  async uploadLogo(
    user: JwtUser,
    filename?: string,
  ): Promise<{ message: string; success: boolean; logoUrl: string }> {
    const { userId, role } = user;
    if (role !== 'employer') {
      throw new UnauthorizedException('Bạn không phải nhà tuyển dụng');
    }

    if (!filename) {
      throw new BadRequestException('Không tìm thấy file logo');
    }

    const logoUrl = `http://localhost:5000/uploads/logos/${filename}`;

    await this.employerModel
      .findOneAndUpdate(
        { user_id: new Types.ObjectId(userId) },
        { $set: { logo: logoUrl } },
        {
          new: true,
          upsert: false,
          sort: { _id: -1 },
        },
      )
      .exec();

    return {
      message: 'Tải logo công ty thành công',
      success: true,
      logoUrl,
    };
  }

  async createEmployer(
    createEmployerDto: CreateEmployerDto,
    user: JwtUser,
  ): Promise<{ message: string; success: boolean; employer: Employer | null }> {
    const { userId, role } = user;
    if (role !== 'employer') {
      throw new UnauthorizedException('Bạn không phải nhà tuyển dụng');
    }

    const {
      company_name,
      description,
      size,
      industry,
      address,
      email,
      website,
      logo,
    } = createEmployerDto;

    const normalizedCompanyName = company_name?.trim();
    if (!normalizedCompanyName) {
      throw new BadRequestException('Tên công ty không được để trống');
    }

    const normalizedSize = size ?? null;

    if (
      normalizedSize !== null &&
      (Number.isNaN(normalizedSize) || normalizedSize < 0)
    ) {
      throw new BadRequestException('Quy mô công ty không hợp lệ');
    }

    const objectUserId = new Types.ObjectId(userId);
    const employer = await this.employerModel
      .findOneAndUpdate(
        { user_id: objectUserId },
        {
          $set: {
            company_name: normalizedCompanyName,
            description: description?.trim() || '',
            size: normalizedSize,
            industry: industry?.trim() || '',
            address: address?.trim() || '',
            email: email?.trim() || '',
            website: website?.trim() || '',
            logo: logo?.trim() || '',
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          sort: { _id: -1 },
          runValidators: true,
        },
      )
      .exec();

    return {
      message: 'Cập nhật hồ sơ công ty thành công',
      success: true,
      employer,
    };
  }
}
