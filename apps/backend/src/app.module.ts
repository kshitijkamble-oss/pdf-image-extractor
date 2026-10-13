import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PdfModule } from './pdf/pdf.module';

@Module({
  imports: [PdfModule],
  controllers: [AppController],
})
export class AppModule {}
