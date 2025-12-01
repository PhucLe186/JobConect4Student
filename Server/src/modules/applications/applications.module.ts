import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { job_applications, jobApplySchema } from './applyjob.schema';
import { CSV, ResumeSchema } from '../resume/resume.schema';
import { Student, StudentSchema } from '../student/student.schema';
import { User, UserSchema } from '../auth/schema/auth.schema';
import { Jobs, JobsSchema } from '../jobs/schema/jobs.schema';
import { Employer, EmployerSchema } from '../employer/employer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: job_applications.name, schema: jobApplySchema },
      { name: CSV.name, schema: ResumeSchema },
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
      { name: Jobs.name, schema: JobsSchema },
      { name: Employer.name, schema: EmployerSchema },
    ]),
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
