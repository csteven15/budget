import { Model, Types } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Amount, AmountDocument } from './amount.schema';
import { CreateAmountInput, GetAmountInput, UpdateAmountInput } from './amount.input';
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

  async getAmount(getAmountInput: GetAmountInput): Promise<Amount[]> {
    this.logger.log(`getting all entires`);
    return this.amountModel
      .find({ ...getAmountInput })
      .exec();
  }

  async getAllAmounts(filter: GetAmountInput): Promise<Amount[]> {
    this.logger.log(`getting all amounts`);
    return this.amountModel.find({...filter}).exec();
  }

  async getAllAmountsForEntry(entryId: Types.ObjectId): Promise<Amount[]> {
    this.logger.log(`getting all entries for ${entryId}`);
    return this.amountModel.find({ entryId: entryId }, null).exec();
  }

  async updateAmount(
    id: Types.ObjectId,
    updateAmountInput: UpdateAmountInput,
  ): Promise<Amount> {
    this.logger.log(`updating ${id}`);
    return this.amountModel
      .findByIdAndUpdate(id, updateAmountInput, { useFindAndModify: false })
      .exec();
  }

  async deleteAmount(id: Types.ObjectId): Promise<Amount> {
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
