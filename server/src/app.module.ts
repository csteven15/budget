import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EntryModule } from './entry/entry.module';
import { UserModule } from './user/user.module';
import { db, dbHost, dbPort } from './util/environment';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${dbHost}:${dbPort}/${db}`),
    UserModule,
    EntryModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
