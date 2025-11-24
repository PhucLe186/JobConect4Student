import { Module } from '@nestjs/common';
import { EmployerController } from './employer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployerService } from './employer.service';
import { Employer, EmployerSchema } from './employer.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employer.name, schema: EmployerSchema },
    ]),
  ],
  controllers: [EmployerController],
  providers: [EmployerService, JwtAuthGuard],
})
export class EmployerModule {}
