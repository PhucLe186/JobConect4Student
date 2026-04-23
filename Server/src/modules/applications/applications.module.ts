import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios'; // <--- THÊM DÒNG NÀY: Dùng để gọi API sang Python

import { job_applications, jobApplySchema } from './applyjob.schema';
import { CSV, ResumeSchema } from '../resume/resume.schema';
import { Student, StudentSchema } from '../student/student.schema';
import { User, UserSchema } from '../auth/schema/auth.schema';
import { Jobs, JobsSchema } from '../jobs/schema/jobs.schema';
import { Employer, EmployerSchema } from '../employer/employer.schema';
import { StudentSkills, StudentSkillSchema } from '../skills/schema/StudentSkill.schema';
import { JobSkills, SkillSchema as JobSkillSchema } from '../skills/schema/JobSkill.schema';
import { Skills, SkillSchema } from '../skills/schema/skills.schema';

@Module({
  imports: [
    HttpModule, // <--- THÊM DÒNG NÀY: Đăng ký quyền gọi HTTP nội bộ
    MongooseModule.forFeature([
      { name: job_applications.name, schema: jobApplySchema },
      { name: CSV.name, schema: ResumeSchema },
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
      { name: Jobs.name, schema: JobsSchema },
      { name: Employer.name, schema: EmployerSchema },
      { name: StudentSkills.name, schema: StudentSkillSchema },
      { name: JobSkills.name, schema: JobSkillSchema },
      { name: Skills.name, schema: SkillSchema },
    ]),
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}