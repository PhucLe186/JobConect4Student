import { Module } from '@nestjs/common';
import { EmployerController } from './employer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployerService } from './employer.service';
import { Employer, EmployerSchema } from './employer.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UserSchema } from '../auth/schema/auth.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employer.name, schema: EmployerSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [EmployerController],
  providers: [EmployerService, JwtAuthGuard],
})
export class EmployerModule {}
