import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['full-time', 'part-time', 'internship'])
  job_type: string;

  @IsString()
  @IsNotEmpty()
  min_salary: string;

  @IsString()
  @IsNotEmpty()
  max_salary: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsDateString()
  @IsNotEmpty()
  deadline: Date;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsEnum([
    'không yêu cầu',
    'dưới 1 năm',
    '1 năm',
    '2 năm',
    '3 năm',
    '4 năm',
    '4 năm trở lên',
  ])
  experience: string;

  @IsString()
  @IsOptional()
  requirements?: string;

  @IsEnum([
    'Intern',
    'Fresher',
    'Junior',
    'Middle',
    'Senior',
    'Lead',
  ])
  @IsOptional()
  level?: string;

  @IsEnum(['open', 'close', 'draft'])
  @IsOptional()
  status?: string;
}
