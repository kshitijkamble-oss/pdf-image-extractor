import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { UPLOADS_ROOT, usesBlobStorage } from './pdf/image-storage.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  if (!usesBlobStorage()) {
    app.useStaticAssets(UPLOADS_ROOT, { prefix: '/api/images/' });
  }
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
