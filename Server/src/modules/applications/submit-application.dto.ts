import { IsString, IsNotEmpty, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class FormDataDto {
  @IsString() @IsNotEmpty() gpa: string;
  @IsString() @IsNotEmpty() level: string;
  @IsString() @IsNotEmpty() position: string;
  @IsString() @IsNotEmpty() address: string;
  @IsString() @IsNotEmpty() skill: string;
  @IsString() @IsNotEmpty() full_name: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() phone: string;
  
  // Thêm trường cover_letter (Tùy chọn, FE có thể gửi hoặc không)
  @IsString() @IsOptional() cover_letter?: string; 
}

export class SubmitFinalCVDto {
  @IsString() @IsNotEmpty() jobId: string;
  // ĐÃ XÓA studentId Ở ĐÂY
  @IsString() @IsNotEmpty() cvFilePath: string;

  @ValidateNested()
  @Type(() => FormDataDto)
  formData: FormDataDto;
}