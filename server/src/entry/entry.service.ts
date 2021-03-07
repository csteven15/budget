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

@Injectable()
export class EntryService {
  private readonly logger = new Logger(EntryService.name);

  constructor(
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
  ) {}

  async createEntry(createEntryInput: CreateEntryInput): Promise<Entry> {
    const entry = new this.entryModel(createEntryInput);
    entry.createdAt = new Date();
    if (createEntryInput?.startDate === undefined) {
      entry.startDate = entry.createdAt;
    }
    if (createEntryInput?.endDate === undefined) {
      entry.endDate = entry.createdAt;
      entry.endDate.setFullYear(entry.endDate.getFullYear() + 1);
    }
    this.logger.log(`created entry ${entry._id}`);
    return entry.save();
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
    this.logger.log(`getting all entires`);
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
    return this.entryModel
      .findByIdAndDelete(id, { useFindAndModify: false })
      .exec();
  }

  async deleteAllEntries(): Promise<Entry> {
    this.logger.log(`deleting all entries`);
    return this.entryModel.deleteMany({}).exec();
  }
}
