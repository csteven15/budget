import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EntryModule } from './entry/entry.module';
import { UserModule } from './user/user.module';

var environment = process.env.NODE_ENV;

const isDevelopment = environment === "development";

let dbPort = isDevelopment ? 27017 : 27018;

let dbHost = isDevelopment ? "localhost" : "mongo";

const db = `mongodb://${dbHost}:${dbPort}/test`;

@Module({
  imports: [
    MongooseModule.forRoot(db),
    UserModule,
    EntryModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
