import { IsString, IsNotEmpty, IsEmail, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class FormDataDto {
  @IsString() @IsNotEmpty() full_name: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsString() @IsOptional() gpa?: string;
  @IsString() @IsOptional() level?: string;
  @IsString() @IsOptional() position?: string;
  @IsString() @IsOptional() address?: string;
  @IsString() @IsOptional() skill?: string;
  @IsString() @IsOptional() cover_letter?: string;
}

export class SubmitFinalCVDto {
  @IsString() @IsNotEmpty() jobId: string;
  @IsString() @IsNotEmpty() cvFilePath: string;
  @ValidateNested()
  @Type(() => FormDataDto)
  formData: FormDataDto;
}