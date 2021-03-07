import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  CreateEntryInputs,
  GetEntryInputs,
  UpdateEntryInputs,
} from './entry.inputs';
import { Entry, EntryDocument } from './entry.schema';

@Injectable()
export class EntryService {
  private readonly logger = new Logger(EntryService.name);

  constructor(
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
  ) {}

  async createEntry(createEntryInputs: CreateEntryInputs): Promise<Entry> {
    const entry = new this.entryModel(createEntryInputs);
    entry.createdAt = new Date();
    this.logger.log(`created entry ${entry._id}`);
    return entry.save();
  }

  async getAllEntries(): Promise<Entry[]> {
    this.logger.log(`getting all entires`);
    return this.entryModel
      .find()
      .populate({
        path: 'amounts',
      })
      .exec();
  }

  async getAllEntriesFilter(getEntryInputs: GetEntryInputs): Promise<Entry[]> {
    this.logger.log(`getting all entires`);
    console.log(
      'startDate',
      getEntryInputs.startDate,
      'endDate',
      getEntryInputs.endDate,
    );
    return this.entryModel
      .find()
      .populate({
        path: 'amounts',
        match: {
          date: {
            $gte: getEntryInputs.startDate,
            $lte: getEntryInputs.endDate,
          },
        },
      })
      .exec();
  }

  async getAllEntriesForUser(userId: string): Promise<Entry[]> {
    this.logger.log(`getting all entries for ${userId}`);
    return this.entryModel
      .find({ userId: userId }, null, {
        sort: {
          year: 1,
        },
      })
      .populate('amounts')
      .exec();
  }

  async updateEntry(
    id: string,
    updateEntryInputs: UpdateEntryInputs,
  ): Promise<Entry> {
    this.logger.log(`updating ${id}`);
    return this.entryModel
      .findByIdAndUpdate(id, updateEntryInputs, { useFindAndModify: false })
      .exec();
  }

  async deleteEntry(id: string): Promise<Entry> {
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
