import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AmountService } from './amount.service';
import { Amount, AmountSchema } from './amount.schema';
import { Entry, EntrySchema } from 'src/entry/entry.schema';
import { AmountController } from './amount.controller';
import { AmountResolver } from './amount.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Amount.name, schema: AmountSchema }]),
    MongooseModule.forFeature([{ name: Entry.name, schema: EntrySchema }]),
  ],
  controllers: [AmountController],
  providers: [AmountService, AmountResolver],
  exports: [AmountModule],
})
export class AmountModule {}
