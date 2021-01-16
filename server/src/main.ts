import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { UserModule } from './user/user.module';
import { EntryModule } from './entry/entry.module';
import { AuthModule } from './auth/auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Budget API User')
    .setDescription('Budget API User')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    include: [
      UserModule,
      EntryModule,
      AuthModule
    ]
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
