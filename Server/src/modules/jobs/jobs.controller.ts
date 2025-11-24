import { Controller, Get } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly JobsService: JobsService) {}

  @Get('')
  async Jobs() {
    return this.JobsService.getJob();
  }
}
