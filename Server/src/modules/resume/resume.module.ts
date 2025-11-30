import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CSV, ResumeSchema } from './resume.schema';
import { Student, StudentSchema } from '../student/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CSV.name, schema: ResumeSchema }]),
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class ResumeModule {}
