import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { EntryModule } from './entry/entry.module';
import { AccountModule } from './account/account.module';
import { isDevelopment } from './util/environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Budget API User')
    .setDescription('Budget API User')
    .setVersion('1.0')
    .addServer(isDevelopment ? '' : '/backend/')
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [EntryModule, AccountModule]
  });
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(3001);
}
bootstrap();
