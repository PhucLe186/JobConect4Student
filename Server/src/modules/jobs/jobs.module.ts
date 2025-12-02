import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobsSchema } from './schema/jobs.schema';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';
import { User, UserSchema } from '../auth/schema/auth.schema';
import { Skills, SkillSchema } from '../skills/schema/skills.schema';
import { JobSkills, JobSkillSchema } from '../skills/schema/JobSkill.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Jobs.name, schema: JobsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Skills.name, schema: SkillSchema }]),
    MongooseModule.forFeature([
      { name: JobSkills.name, schema: JobSkillSchema },
    ]),
  ],
  controllers: [JobsController],
  providers: [JobsService, JwtAuthGuard],
})
export class JobsModule {}
