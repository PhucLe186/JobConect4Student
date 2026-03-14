import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    app.enableCors({
      origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:5500', 'http://localhost:5500'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    
    app.use(cookieParser());
    
    // Add global exception filter
    app.useGlobalFilters(new AllExceptionsFilter());
    
    // Add global validation pipe
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      disableErrorMessages: false,
    }));
    
    // Serve static files
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
      prefix: '/uploads/',
    });
    
    const port = process.env.PORT ?? 5000;
    await app.listen(port);
    console.log(`Server running on port ${port}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}
bootstrap();
