import { Body, Controller, Get, Post, Req, Query, UseGuards, UseInterceptors, UploadedFile, Param, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import type { Request } from 'express';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubmitFinalCVDto } from './submit-application.dto';

const cvUploadOptions = {
  storage: diskStorage({
    destination: './uploads/cvs',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `cv-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|jpeg|jpg|png)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, JPG, PNG files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  // =========================================================
  // API 1: SƠ DUYỆT BẰNG AI (GỌI PYTHON CHẤM ĐIỂM)
  // Đã sửa 'smart-apply' thành 'apply-smart'
  // Đã sửa 'CV' thành 'cv'
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Post('apply-smart/:jobId')
  @UseInterceptors(FileInterceptor('cv', cvUploadOptions))
  async smartApplyJob(
    @Param('jobId') jobId: string,
    @UploadedFile() cvFile: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!cvFile) throw new BadRequestException('Vui lòng tải lên file CV');
    
    // Gọi sang Service
    const result = await this.applicationsService.smartApplyJob(jobId, req.user as JwtUser, cvFile);
    return { success: true, data: result };
  }

  // =========================================================
  // API: PREVIEW SCORE (chấm điểm thật từ form, KHÔNG lưu DB)
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Post('preview-score/:jobId')
  async previewScore(
    @Param('jobId') jobId: string,
    @Body() formData: any,
  ) {
    const result = await this.applicationsService.previewScore(jobId, formData);
    return { success: true, data: result };
  }

  // =========================================================
  // API 2: NỘP FORM CHÍNH THỨC (NESTJS TÁI CHẤM ĐIỂM)
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Post('submit-final')
  async submitFinalCV(
    @Body() submitDto: SubmitFinalCVDto,
    @Req() req: Request
  ) {
    const result = await this.applicationsService.submitFinalCV(
      submitDto.jobId,
      req.user as JwtUser,
      submitDto.cvFilePath,
      submitDto.formData
    );
    return { success: true, data: result };
  }

  // =========================================================
  // API 3: PHÂN TÍCH NHÁP CV BẰNG AI (Dự phòng nếu cần)
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Post('analyze-draft/:jobId')
  @UseInterceptors(FileInterceptor('cv', cvUploadOptions)) 
  async analyzeCVDraft(
    @Param('jobId') jobId: string,
    @UploadedFile() cvFile: Express.Multer.File,
  ) {
    if (!cvFile) throw new BadRequestException('Vui lòng tải lên file CV');
    const aiResult = await this.applicationsService.analyzeCVDraft(jobId, cvFile);
    return { success: true, data: aiResult, cvFilePath: cvFile.path }; 
  }

  // =========================================================
  // CÁC API CŨ CỦA BẠN (GIỮ NGUYÊN HOÀN TOÀN)
  // =========================================================
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

  // Fallback không có file CV (AI không chạy)
  @UseGuards(JwtAuthGuard)
  @Post('apply-no-file')
  async applyNoFile(
    @Body() applicationData: { jobId: string; fullName: string; email: string; phone: string; coverLetter?: string },
    @Req() req: Request
  ) {
    return this.applicationsService.applyWithDetails(
      applicationData,
      null as any,
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
  async getEmployerCandidates(
    @Req() req: Request,
    @Query('minGpa') minGpa?: string,
    @Query('minMatchScore') minMatchScore?: string,
    @Query('level') level?: string,
    @Query('address') address?: string,
    @Query('skills') skills?: string,
  ) {
    const filterCriteria = {
      ...(minGpa !== undefined && { minGpa: parseFloat(minGpa) }),
      ...(minMatchScore !== undefined && { minMatchScore: parseFloat(minMatchScore) }),
      ...(level && { level }),
      ...(address && { address }),
      ...(skills && { skills: skills.split(',').map((s) => s.trim()).filter(Boolean) }),
    };
    return this.applicationsService.getEmployerCandidates(
      req.user as JwtUser,
      Object.keys(filterCriteria).length ? filterCriteria : undefined,
    );
  }

  // =========================================================
  // API: HIỂN THỊ CV ƯU TÚ CHO NHÀ TUYỂN DỤNG
  // GET /applications/top-candidates?jobId=xxx&limit=10
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Get('top-candidates')
  async getTopCandidates(
    @Req() req: Request,
    @Query('jobId') jobId?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.applicationsService.getTopCandidates(
      req.user as JwtUser,
      jobId,
      parsedLimit,
    );
  }
}