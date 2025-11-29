import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobsSchema } from './schema/jobs.schema';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JwtAuthGuard } from '../auth/Jwt/jwt-auth.guard';
import { User, UserSchema } from '../auth/schema/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Jobs.name, schema: JobsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [JobsController],
  providers: [JobsService, JwtAuthGuard],
})
export class JobsModule {}
