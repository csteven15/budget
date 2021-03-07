import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AmountController } from './amount.controller';
import { AmountService } from './amount.service';
import { Amount, AmountSchema } from './amount.schema';
import { Entry, EntrySchema } from 'src/entry/entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Amount.name, schema: AmountSchema }]),
    MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }]),
  ],
  controllers: [AmountController],
  providers: [AmountService],
  exports: [AmountModule],
})
export class AmountModule {}
