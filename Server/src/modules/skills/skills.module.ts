import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { Skills, SkillSchema } from './schema/skills.schema';
import { StudentSkills, StudentSkillSchema } from './schema/StudentSkill.schema';
import { Student, StudentSchema } from '../student/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Skills.name, schema: SkillSchema },
      { name: StudentSkills.name, schema: StudentSkillSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService]
})
export class SkillsModule {}
