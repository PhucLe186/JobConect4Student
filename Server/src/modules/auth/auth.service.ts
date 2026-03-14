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
import { JwtUser } from './interface/jwt-user.interface';

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
    
    console.log('Register DTO received:', {
      name,
      email,
      password: '***',
      dateOfbirth,
      gender,
      role,
      roleType: typeof role
    });

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
  ): Promise<{ accesstoken: string; type: string; laguage: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu sai');
    }

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
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.cookie('refresh_token', refreshtoken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return {
      accesstoken: accesstoken,
      type: user.role,
      laguage: user.language,
    };
  }

  async Logout(req: Request, res: Response): Promise<{ message: string }> {
    const refreshtoken = req.cookies['refresh_token'];
    if (refreshtoken) {
      await this.RefreshtokenModel.deleteOne({ RefreshToken: refreshtoken });
      res.clearCookie('refresh_token');
    }
    return { message: 'đăng xuất thành công' };
  }

  async RefreshToken(
    req: Request,
    res: Response,
  ): Promise<{ accesstoken: string; type: string; language: string }> {
    const token = req.cookies['refresh_token'];
    if (!token) {
      throw new BadRequestException('token không tồn tại');
    }
    const session = await this.RefreshtokenModel.findOne({
      RefreshToken: token,
    });

    if (!session) {
      throw new BadRequestException('token không tồn tại');
    }

    if (session.expiresAt < new Date()) {
      throw new BadRequestException('Token đã hết hạn.');
    }
    const user = await this.userModel.findOne({ _id: session.userID });

    const payload = {
      id: (user as any)._id.toString(),
      email: (user as any).email,
      role: (user as any).role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accesstoken: accessToken,
      type: user?.role || 'user',
      language: user?.language || 'vi',
    };
  }

  async ChangeLanguage(lang: string, user: JwtUser): Promise<{ lang: string }> {
    const { userId } = user;
    console.log(userId);
    if (!userId) {
      throw new BadRequestException('Bạn chưa đăng nhập');
    }
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { language: lang } },
    );

    return { lang };
  }
}
