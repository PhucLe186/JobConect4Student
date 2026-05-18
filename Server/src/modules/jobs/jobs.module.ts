import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobsSchema } from './schema/jobs.schema';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UserSchema } from '../auth/schema/auth.schema';
import { Student, StudentSchema } from '../student/student.schema';
import { StudentSkills, StudentSkillSchema } from '../skills/schema/StudentSkill.schema';
import { Skills, SkillSchema } from '../skills/schema/skills.schema';
import { JobSkills, SkillSchema as JobSkillSchema } from '../skills/schema/JobSkill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Jobs.name, schema: JobsSchema },
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
      { name: StudentSkills.name, schema: StudentSkillSchema },
      { name: Skills.name, schema: SkillSchema },
      { name: JobSkills.name, schema: JobSkillSchema },
    ]),
  ],
  controllers: [JobsController],
  providers: [JobsService, JwtAuthGuard],
})
export class JobsModule {}
