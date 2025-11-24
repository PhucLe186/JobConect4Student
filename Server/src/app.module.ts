import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { EmployerService } from './modules/employer/employer.service';
import { EmployerModule } from './modules/employer/employer.module';
import { StudentModule } from './modules/student/student.module';
import { JobsController } from './modules/jobs/jobs.controller';
import { JobsService } from './modules/jobs/jobs.service';
import { JobsModule } from './modules/jobs/jobs.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://hoangphuc1806:Phucle%401806@connect4student.dbrrwmk.mongodb.net/connect4Student?retryWrites=true&w=majority',
    ),
    AuthModule,
    EmployerModule,
    StudentModule,
    JobsModule,
  ],
  controllers: [AppController, JobsController],
  providers: [AppService, JobsService],
})
export class AppModule {}
