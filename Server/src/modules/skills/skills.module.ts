import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { Skills, SkillSchema } from './schema/skills.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Skills.name, schema: SkillSchema }])],
  controllers: [SkillsController],
  providers: [SkillsService],
  exports: [SkillsService]
})
export class SkillsModule {}
