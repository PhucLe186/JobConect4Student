import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors, UploadedFile, Param, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import type { Request } from 'express';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// Nhớ import DTO mà chúng ta đã tạo ở bước trước (Sửa lại đường dẫn nếu cần)
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
    // Đã mở rộng Regex xíu để chắc chắn bắt đúng file ảnh nếu AI Python cần ảnh
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
  // [MỚI] API 1: PHÂN TÍCH NHÁP CV BẰNG AI
  // FE gửi file lên (tên field là 'cv'), gọi Python trả về JSON
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Post('analyze-draft/:jobId')
  @UseInterceptors(FileInterceptor('cv', cvUploadOptions)) 
  async analyzeCVDraft(
    @Param('jobId') jobId: string,
    @UploadedFile() cvFile: Express.Multer.File,
  ) {
    if (!cvFile) throw new BadRequestException('Vui lòng tải lên file CV');
    
    // Gọi sang Service
    const aiResult = await this.applicationsService.analyzeCVDraft(jobId, cvFile);
    return { success: true, data: aiResult, cvFilePath: cvFile.path }; 
    // Trả luôn cvFilePath về cho FE giữ, để lát nữa FE ném lại lúc nộp Form chính thức
  }

  // =========================================================
  // [MỚI] API 2: NỘP FORM CHÍNH THỨC (SAU KHI ĐÃ VERIFY)
  // =========================================================
  @UseGuards(JwtAuthGuard)
  @Post('submit-final')
  async submitFinalCV(
    @Body() submitDto: SubmitFinalCVDto,
    @Req() req: Request
  ) {
    // Truyền thẳng req.user vào để lấy userId lưu vào DB
    const result = await this.applicationsService.submitFinalCV(
      submitDto.jobId,
      req.user as JwtUser,
      submitDto.cvFilePath, // FE sẽ gửi lại đường dẫn file đã upload ở API 1
      submitDto.formData
    );
    return { success: true, data: result };
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