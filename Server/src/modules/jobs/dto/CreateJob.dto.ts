import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  industry: string;

  @IsEnum([
    'Nhân viên',
    'Trưởng nhóm',
    'Trưởng/Phó phòng',
    'Quản lý / Giám sát',
    'Trưởng chi nhánh',
    'Phó giám đốc',
    'Giám đốc',
    'Thực tập sinh',
  ])
  @IsString()
  level: string;

  @IsOptional()
  @IsString()
  job_type?: string;

  @IsOptional()
  @IsString()
  min_salary?: string;

  @IsOptional()
  @IsString()
  max_salary?: string;

  @IsEnum([
    'không yêu cầu',
    'dưới 1 năm',
    '1 năm',
    '2 năm',
    '3 năm',
    '4 năm',
    '4 năm trở lên',
  ])
  @IsString()
  experience: string;

  @IsString()
  requirements: string;

  @IsString()
  location: string;

  @IsString()
  deadline: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDTO)
  skills: SkillDTO[];
}

export class SkillDTO {
  @IsString()
  skill_name: string;

  @IsOptional()
  skill_id: number;
}
