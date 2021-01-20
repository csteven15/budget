import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Entry, EntryDocument } from './schemas/entry.schema';
import { CreateEntryDto, UpdateEntryDto } from './dtos';

@Injectable()
export class EntryService {
  constructor(
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
  ) {}

  async createEntry(createEntryDto: CreateEntryDto): Promise<Entry> {
    const entry = new this.entryModel(createEntryDto);
    return entry.save();
  }

  async getAllEntries(): Promise<Entry[]> {
    return this.entryModel.find().exec();
  }

  async getAllEntriesForUser(uid: string): Promise<Entry[]> {
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
    return this.entryModel.findByIdAndUpdate(id, updateEntryDto).exec();
  }

  async deleteEntry(id: string): Promise<Entry> {
    return this.entryModel.findByIdAndDelete(id).exec();
  }
}
