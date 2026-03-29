import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmployerService } from './employer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import { CreateEmployerDto } from './tdo/employer.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';

@Controller('employer')
export class EmployerController {
  constructor(private readonly employerService: EmployerService) {}

  @Get('')
  async employer() {
    return this.employerService.employer();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async employerProfile(@Req() req: Request) {
    return this.employerService.getEmployerProfile(req.user as JwtUser);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-logo')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadPath = './uploads/logos';
          mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, 'logo-' + uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/i)) {
          return cb(
            new Error('Chi cho phep file jpg, jpeg, png, webp'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadLogo(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.employerService.uploadLogo(req.user as JwtUser, file?.filename);
  }

  @Get('/:id')
  async employerdedtail(@Param('id') id: string) {
    return this.employerService.employerDetail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createEmployer(
    @Req() req: Request,
    @Body() createEmployerDto: CreateEmployerDto,
  ) {
    return this.employerService.createEmployer(
      createEmployerDto,
      req.user as JwtUser,
    );
  }
}
