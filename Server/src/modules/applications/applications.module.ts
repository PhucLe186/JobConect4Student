import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { job_applications, jobApplySchema } from './applyjob.schema';
import { CSV, ResumeSchema } from '../resume/resume.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: job_applications.name, schema: jobApplySchema },
    ]),
    MongooseModule.forFeature([{ name: CSV.name, schema: ResumeSchema }]),
  ],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
