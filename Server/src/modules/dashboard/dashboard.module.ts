import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { User, UserSchema } from '../auth/schema/auth.schema';
import { Jobs, JobsSchema } from '../jobs/schema/jobs.schema';
import { job_applications, jobApplySchema } from '../applications/applyjob.schema';
import { Forum, ForumSchema } from '../forum/forum.scheme';
import { Message, MessageSchema } from '../comment/message.schema';
import { Employer, EmployerSchema } from '../employer/employer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Jobs.name, schema: JobsSchema },
      { name: job_applications.name, schema: jobApplySchema },
      { name: Forum.name, schema: ForumSchema },
      { name: Message.name, schema: MessageSchema },
      { name: Employer.name, schema: EmployerSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}