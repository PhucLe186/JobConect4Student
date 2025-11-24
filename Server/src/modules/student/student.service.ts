import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './student.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { JwtUser } from '../auth/interface/jwt-user.interface';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private StudentModel: Model<StudentDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
  ) {}

  async getStudentbyID(user: JwtUser): Promise<object | null> {
    const { userId } = user;
    const User = await this.UserModel.findById(userId)
      .select('name email dateOfbirth gender')
      .populate('Student')
      .lean()
      .exec();

    const result = { ...User, ...(User as any).Student };
    delete result.Student;
    delete result._id;
    return result;
  }
}
