import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schema/auth.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshToken, TokenDocument } from './schema/token.schma';
import * as crypto from 'crypto';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(RefreshToken.name)
    private RefreshtokenModel: Model<TokenDocument>,
    private jwtService: JwtService,
  ) {}

  async Register(registerDto: RegisterDto): Promise<User> {
    const { name, email, password, dateOfbirth, gender, role } = registerDto;

    const existingEmail = await this.userModel.findOne({ email });
    if (existingEmail) {
      throw new BadRequestException('Email đã tồn tại');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      dateOfbirth: new Date(dateOfbirth),
      gender,
      role,
    });

    return newUser.save();
  }

  async Login(
    loginDto: LoginDto,
    res: Response,
  ): Promise<{ accesstoken: string; type: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu sai');
    }
    console.log(user.role);
    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    const accesstoken = this.jwtService.sign(payload);
    const refreshtoken = crypto.randomBytes(64).toString('hex');

    await this.RefreshtokenModel.create({
      userID: user._id,
      RefreshToken: refreshtoken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookie('refresh_token', refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { accesstoken: accesstoken, type: user.role };
  }

  async Logout(req: Request, res: Response): Promise<{ message: string }> {
    const refreshtoken = req.cookies['refresh_token'];
    if (refreshtoken) {
      await this.RefreshtokenModel.deleteOne({ RefreshToken: refreshtoken });
      res.clearCookie('refresh_token');
    }
    return { message: 'đăng xuất thành công' };
  }
}
