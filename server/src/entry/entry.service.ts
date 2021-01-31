import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Entry, EntryDocument } from './schemas/entry.schema';
import { CreateEntryDto, UpdateEntryDto } from './dtos';

@Injectable()
export class EntryService {
  private readonly logger = new Logger(EntryService.name);

  constructor(
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
  ) {}

  async createEntry(createEntryDto: CreateEntryDto): Promise<Entry> {
    const entry = new this.entryModel(createEntryDto);
    this.logger.log(`created entry ${entry._id}`);
    return entry.save();
  }

  async getAllEntries(): Promise<Entry[]> {
    this.logger.log(`getting all entires`);
    return this.entryModel.find().exec();
  }

  async getAllEntriesForUser(uid: string): Promise<Entry[]> {
    this.logger.log(`getting all entries for ${uid}`);
    return this.entryModel
      .find({ uid: uid }, null, {
        sort: {
          year: 1,
        },
      })
      .exec();
  }

  async updateEntry(
    id: string,
    updateEntryDto: UpdateEntryDto,
  ): Promise<Entry> {
    this.logger.log(`updating ${id}`);
    return this.entryModel
      .findByIdAndUpdate(id, updateEntryDto, { useFindAndModify: false })
      .exec();
  }

  async deleteEntry(id: string): Promise<Entry> {
    this.logger.log(`deleting ${id}`);
    return this.entryModel
      .findByIdAndDelete(id, { useFindAndModify: false })
      .exec();
  }
}
