import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobsSchema } from './jobs.schema';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Jobs.name, schema: JobsSchema }]),
  ],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
