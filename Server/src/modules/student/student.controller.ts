import { Controller, Get, Post, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentService } from './student.service';
import type { Request } from 'express';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import type { File } from 'multer';
import { extname } from 'path';

@Controller('student')
export class StudentController {
  constructor(private readonly StudentService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('')
  async Student(@Req() req: Request) {
    return this.StudentService.getStudentbyID(req.user as JwtUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/avatars',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  }))
  async uploadAvatar(@UploadedFile() file: File, @Req() req: Request) {
    return this.StudentService.updateAvatar(req.user as JwtUser, file.filename);
  }
}
