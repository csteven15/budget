import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryController } from './entry.controller';
import { EntryService } from './entry.service';
import { Entry, EntrySchema } from './entry.schema';
import { EntryResolver } from './entry.resolver';
import { Amount, AmountSchema } from 'src/amount/amount.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }]),
    MongooseModule.forFeature([{ name: Amount.name, schema: AmountSchema }]),
  ],
  controllers: [EntryController],
  providers: [EntryService, EntryResolver],
  exports: [EntryModule],
})
export class EntryModule {}
