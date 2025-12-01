import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AdminSeedService } from './admin/admin.seed';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  
  // Create default admin user
  const adminSeedService = app.get(AdminSeedService);
  await adminSeedService.createDefaultAdmin();
  
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
