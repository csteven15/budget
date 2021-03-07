import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Amount, AmountDocument } from './amount.schema';
import { CreateAmountInputs, UpdateAmountInputs } from './amount.inputs';
import { Entry, EntryDocument } from 'src/entry/entry.schema';

@Injectable()
export class AmountService {
  private readonly logger = new Logger(AmountService.name);

  constructor(
    @InjectModel(Amount.name) private amountModel: Model<AmountDocument>,
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
  ) {}

  async createAmount(createAmountInputs: CreateAmountInputs): Promise<Amount> {
    const amount = new this.amountModel(createAmountInputs);
    this.logger.log(`created amount ${amount._id}`);
    const entry = await this.entryModel.findOne({
      _id: createAmountInputs.entryId,
    });
    entry.amounts.push(amount.id);
    entry.save();
    return amount.save();
  }

  async getAllAmounts(): Promise<Amount[]> {
    this.logger.log(`getting all amounts`);
    return this.amountModel.find().exec();
  }

  async getAllAmountsForEntry(entryId: string): Promise<Amount[]> {
    this.logger.log(`getting all entries for ${entryId}`);
    return this.amountModel.find({ entryId: entryId }, null).exec();
  }

  async updateAmount(
    id: string,
    updateAmountInputs: UpdateAmountInputs,
  ): Promise<Amount> {
    this.logger.log(`updating ${id}`);
    return this.amountModel
      .findByIdAndUpdate(id, updateAmountInputs, { useFindAndModify: false })
      .exec();
  }

  async deleteAmount(id: string): Promise<Amount> {
    this.logger.log(`deleting ${id}`);
    const amount = await this.amountModel.findById(id);
    const entry = await this.entryModel.findById(amount.entryId);
    const index = entry.amounts.indexOf(amount);
    entry.amounts.splice(index, 1);
    entry.save();
    return this.amountModel
      .findByIdAndDelete(id, { useFindAndModify: false })
      .exec();
  }

  async deleteAllAmounts(): Promise<Amount> {
    this.logger.log(`deleting all amounts`);
    return this.amountModel.deleteMany({}).exec();
  }
}
