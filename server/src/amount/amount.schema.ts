import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AmountDocument = Amount & Document;

@Schema()
export class Amount {
  @Prop({ required: true })
  entryId: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  amount: number;
}

export const AmountSchema = SchemaFactory.createForClass(Amount);
