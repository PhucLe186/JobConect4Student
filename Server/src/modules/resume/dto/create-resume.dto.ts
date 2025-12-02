import { IsString, IsOptional, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ExperienceDto {
  @IsNumber()
  id: number;

  @IsString()
  company: string;

  @IsString()
  time: string;

  @IsString()
  role: string;

  @IsArray()
  @IsString({ each: true })
  tasks: string[];
}

export class EducationDto {
  @IsNumber()
  id: number;

  @IsString()
  company: string;

  @IsString()
  time: string;

  @IsString()
  role: string;
}

export class CreateResumeDto {
  @IsString()
  title: string;

  @IsString()
  template_type: string;

  @IsString()
  fullname: string;

  @IsOptional()
  @IsString()
  birth?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  brand_color?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experience?: ExperienceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education?: EducationDto[];
}