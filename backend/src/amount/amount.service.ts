import { Model, Types } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Amount, AmountDocument } from './amount.schema';
import {
  CreateAmountInput,
  GetAmountInput,
  UpdateAmountInput,
} from './amount.input';
import { Entry, EntryDocument } from 'src/entry/entry.schema';

@Injectable()
export class AmountService {
  private readonly logger = new Logger(AmountService.name);

  constructor(
    @InjectModel(Amount.name) private amountModel: Model<AmountDocument>,
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
  ) {}

  async createAmount(createAmountInput: CreateAmountInput): Promise<Amount> {
    const amount = new this.amountModel(createAmountInput);
    this.logger.log(`created amount ${amount._id}`);
    const entry = await this.entryModel.findOne({
      _id: createAmountInput.entryId,
    });
    entry.amounts.push(amount.id);
    entry.save();
    return amount.save();
  }

  async getAmountById(_id: Types.ObjectId): Promise<Amount> {
    this.logger.log(`getting amount with id ${_id}`);
    return this.amountModel.findById(_id).exec();
  }

  async getAmounts(getAmountInput: GetAmountInput): Promise<Amount[]> {
    this.logger.log(`getting all entires`);
    return this.amountModel
      .find({ ...getAmountInput }, null, { sort: { date: 1 } })
      .exec();
  }

  async updateAmount(updateAmountInput: UpdateAmountInput): Promise<Amount> {
    this.logger.log(`updating ${updateAmountInput._id}`);
    return this.amountModel
      .findByIdAndUpdate(updateAmountInput._id, updateAmountInput, {
        useFindAndModify: false,
      })
      .exec();
  }

  async deleteAmount(_id: Types.ObjectId): Promise<Amount> {
    this.logger.log(`deleting ${_id}`);
    const amount = await this.amountModel.findById(_id);
    const entry = await this.entryModel.findById(amount.entryId);
    const index = entry.amounts.indexOf(amount);
    entry.amounts.splice(index, 1);
    entry.save();
    return this.amountModel
      .findByIdAndDelete(_id, { useFindAndModify: false })
      .exec();
  }

  async deleteAllAmounts(): Promise<Amount> {
    this.logger.log(`deleting all amounts`);
    return this.amountModel.remove().exec();
  }
}
