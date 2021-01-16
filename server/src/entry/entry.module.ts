import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { Entry, EntrySchema } from './schemas/entry.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }])],
  controllers: [EntryController],
  providers: [EntryService],
  exports: [EntryModule]
})

export class EntryModule { }