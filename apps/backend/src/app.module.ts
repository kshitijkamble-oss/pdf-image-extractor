import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { PdfModule } from './pdf/pdf.module.js';

@Module({
  imports: [PdfModule],
  controllers: [AppController],
})
export class AppModule {}
