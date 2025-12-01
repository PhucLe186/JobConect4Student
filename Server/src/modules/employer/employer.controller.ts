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
import { EmployerService } from './employer.service';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';
import type { Request } from 'express';
import { CreateEmployerDto } from './tdo/employer.dto';
import { JwtUser } from '../auth/interface/jwt-user.interface';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('employer')
export class EmployerController {
  constructor(
    private readonly employerService: EmployerService,
    private readonly CloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('information')
  async Information(
    @Req()
    req: Request,
  ) {
    return this.employerService.InformationEmploy(req.user as JwtUser);
  }

  @Get('')
  async employer() {
    return this.employerService.employer();
  }

  @Get('/:id')
  async employerdedtail(@Param('id') id: string) {
    return this.employerService.employerDetail(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async createEmployer(
    @UploadedFile() file: Express.Multer.File,
    @Req()
    req: Request,
    @Body() createEmployerDto: CreateEmployerDto,
  ) {
    let logoUrl = null;
    if (file) {
      const result = await this.CloudinaryService.uploadFile(file);
      logoUrl = result.secure_url;
    }
    return this.employerService.createEmployer(
      createEmployerDto,
      req.user as JwtUser,
      logoUrl,
    );
  }
}
