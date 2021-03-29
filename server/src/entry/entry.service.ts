import { Model, Types } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  CreateEntryInput,
  GetEntryDateFilterInput,
  GetEntryInput,
  UpdateEntryInput,
} from './entry.input';
import { Entry, EntryDocument } from './entry.schema';
import { Amount, AmountDocument } from 'src/amount/amount.schema';
import { CreateAmountInput } from 'src/amount/amount.input';

require('datejs');

@Injectable()
export class EntryService {
  private readonly logger = new Logger(EntryService.name);

  private GetNextDatesByFrequency(date: Date, frequency: number) {
    let dates: Date[] = [ date ]
    let lastDate = new Date(date)
    for (let i = 0; i < frequency; i++) {
      let temp = new Date(lastDate)
      switch (frequency) {
        case 1: {
          temp.addYears(1)
          break;
        }
        case 2:{
          temp.addMonths(6)
          break;
        }
        case 12: {
          temp.addMonths(1)
          break;
        }
        case 26: {
          temp.addDays(14)
          break;
        }
        case 52: {
          temp.addDays(7)
          break
        }
      }
      dates.push(new Date(temp))
      lastDate = temp
    }
    return dates
  }

  constructor(
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
    @InjectModel(Amount.name) private amountModel: Model<AmountDocument>,
  ) {}

  async createEntry(createEntryInput: CreateEntryInput): Promise<Entry> {
    const entry = new this.entryModel(createEntryInput);
    entry.createdAt = new Date();
    if (createEntryInput?.startDate === undefined) {
      entry.startDate = entry.createdAt;
    }
    this.logger.log(`created entry ${entry._id}`);
    if (createEntryInput?.frequency !== undefined) {
      const numberOfAmountsToCreate = createEntryInput.frequency + 1;
      const dates = this.GetNextDatesByFrequency(createEntryInput.startDate, createEntryInput.frequency);
      this.logger.log(`amounts ${numberOfAmountsToCreate}`);
      for (let i = 0; i < numberOfAmountsToCreate; i++) {
        const amountInput: CreateAmountInput = {
          entryId: entry.id,
          date: dates[i],
          amount: entry.budgetedAmount,
          paid: false,
        };
        const amount = new this.amountModel(amountInput);
        amount.save();
        entry.amounts.push(amount.id);
      }
      this.logger.log(
        `created ${numberOfAmountsToCreate} amounts for ${entry._id}`,
      );
    }
    return (await entry.save()).populate({ path: 'amounts' }).execPopulate();
  }

  async getEntryById(_id: Types.ObjectId): Promise<Entry> {
    this.logger.log(`getting entry with id ${_id}`);
    return this.entryModel
      .findById(_id)
      .populate({
        path: 'amounts',
      })
      .exec();
  }

  async getEntries(
    getEntryInput: GetEntryInput,
    getEntryDateFilterInput: GetEntryDateFilterInput,
  ): Promise<Entry[]> {
    if (getEntryDateFilterInput) {
      this.logger.log(
        `getting all entires with date filter`,
      );
    } else {
      this.logger.log(
        `getting all entires without date filter`,
      );
    }
    
    let matchObject = {};
    if (
      getEntryDateFilterInput?.startDate &&
      getEntryDateFilterInput?.endDate
    ) {
      matchObject = {
        date: {
          $gte: getEntryDateFilterInput?.startDate,
          $lte: getEntryDateFilterInput?.endDate,
        },
      };
    }
    return this.entryModel
      .find(
        {
          ...getEntryInput,
        },
        null,
        {
          sort: {
            type: 1,
            date: 1,
          },
        },
      )
      .populate({
        path: 'amounts',
        match: matchObject,
      })
      .exec();
  }

  async updateEntry(updateEntryInputs: UpdateEntryInput): Promise<Entry> {
    this.logger.log(`updating ${updateEntryInputs._id}`);
    return this.entryModel
      .findByIdAndUpdate(updateEntryInputs._id, updateEntryInputs, {
        useFindAndModify: false,
      })
      .populate('amounts')
      .exec();
  }

  async deleteEntry(id: Types.ObjectId): Promise<Entry> {
    this.logger.log(`deleting ${id}`);
    this.amountModel.deleteMany({ entryId: id });
    return this.entryModel
      .findByIdAndDelete(id, { useFindAndModify: false })
      .exec();
  }

  async deleteAllEntries(): Promise<Entry> {
    this.logger.log(`deleting all entries`);
    return this.entryModel.remove().exec();
  }
}
