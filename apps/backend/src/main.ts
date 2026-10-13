import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { UPLOADS_ROOT } from './pdf/pdf.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useStaticAssets(UPLOADS_ROOT, { prefix: '/api/images/' });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
