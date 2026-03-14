import { IsEmail, IsNotEmpty, IsString, IsDateString, IsIn, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be valid' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  readonly password: string;

  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString({}, { message: 'Date of birth must be a valid date' })
  readonly dateOfbirth: Date;

  @IsNotEmpty({ message: 'Gender is required' })
  @IsString({ message: 'Gender must be a string' })
  readonly gender: string;

  @IsNotEmpty({ message: 'Role is required' })
  @IsString({ message: 'Role must be a string' })
  @IsIn(['student', 'employer', 'admin'], { message: 'Role must be one of: student, employer, admin' })
  readonly role: string;
}
