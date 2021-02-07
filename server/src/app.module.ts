import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EntryModule } from './entry/entry.module';
import { AccountModule } from './account/account.module';
import { db, dbHost, dbPort } from './util/environment';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${dbHost}:${dbPort}/${db}`),
    EntryModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
