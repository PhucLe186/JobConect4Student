import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skills, SkillDocument } from './schema/skills.schema';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel(Skills.name) private skillsModel: Model<SkillDocument>,
  ) {}

  async getAllSkills() {
    return this.skillsModel.find().lean().exec();
  }
}
