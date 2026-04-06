import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import type { Request } from 'express';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const cvUploadOptions = {
  storage: diskStorage({
    destination: './uploads/cvs',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `cv-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('cv', cvUploadOptions))
  async ApplyJob(
    @Body('id') job_id: string,
    @Body('coverLetter') coverLetter: string,
    @UploadedFile() cvFile: Express.Multer.File,
    @Req() req: Request,
  ) {
    return this.applicationsService.applyJobs(job_id, req.user as JwtUser, {
      cvFile,
      coverLetter,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('apply-with-details')
  @UseInterceptors(FileInterceptor('cv', cvUploadOptions))
  async applyWithDetails(
    @Body() applicationData: {
      jobId: string;
      fullName: string;
      email: string;
      phone: string;
      coverLetter?: string;
    },
    @UploadedFile() cvFile: Express.Multer.File,
    @Req() req: Request
  ) {
    return this.applicationsService.applyWithDetails(
      applicationData,
      cvFile,
      req.user as JwtUser
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async testAuth(@Req() req: Request) {
    return { message: 'Auth working', user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getApplicationHistory(@Req() req: Request) {
    return this.applicationsService.getApplicationHistory(req.user as JwtUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('employer-candidates')
  async getEmployerCandidates(@Req() req: Request) {
    return this.applicationsService.getEmployerCandidates(req.user as JwtUser);
  }
}
