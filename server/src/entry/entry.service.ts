import { Model, Types } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  CreateEntryInput,
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

  async getEntry(getEntryInput: GetEntryInput): Promise<Entry[]> {
    this.logger.log(`getting all entires`);
    console.log({
      _id: getEntryInput?._id ?? null,
      userId: getEntryInput?.userId ?? null,
      name: getEntryInput?.name ?? null,
      type: getEntryInput?.type ?? null
    })
    return this.entryModel
      .find({
        ...getEntryInput,
      })
      .populate({
        path: 'amounts',
        match: {
          date: {
            $gte: getEntryInput?.startDate,
            $lte: getEntryInput?.endDate,
          },
        }
      })
      .exec();
  }

  async getAllEntriesForUser(userId: Types.ObjectId): Promise<Entry[]> {
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
    id: Types.ObjectId,
    updateEntryInputs: UpdateEntryInput,
  ): Promise<Entry> {
    this.logger.log(`updating ${id}`);
    return this.entryModel
      .findByIdAndUpdate(id, updateEntryInputs, { useFindAndModify: false })
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
