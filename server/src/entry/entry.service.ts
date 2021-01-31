import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as faker from 'faker';

import { Entry, EntryDocument } from './schemas/entry.schema';
import { CreateEntryDto, UpdateEntryDto } from './dtos';
import { IEntry } from './interfaces/entry.interface';

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

  async fakeEntries(
    uid: string,
    entries: number,
    inputType: number,
  ): Promise<void> {
    if (entries > 200) {
      entries = 200;
    }
    const entryType = inputType === 0 ? 'income' : 'expense';
    this.logger.log(`making ${entries} ${entryType} entries for uid ${uid}`);
    const today = new Date();
    const past = new Date(today.getFullYear() - 2, today.getMonth(), today.getDate());
    const future = new Date(today.getFullYear() + 2, today.getMonth(), today.getDate());
    const numEntries = entries;
    const randomEntries = Array<IEntry>(numEntries);
    for (let i = 0; i < numEntries; i++) {
      const maxAmount = Math.floor(Math.random() * (500000 - 1) + 1);
      const monthlyAmount: Array<number> = new Array<number>(12);
      for (let j = 0; j < 12; j++) {
        monthlyAmount[j] = Number.parseFloat(
          faker.finance.amount(1, maxAmount, 2),
        );
      }

      const randomEntry: IEntry = {
        uid: uid,
        inputType: inputType,
        name: inputType === 0 ? faker.name.jobTitle() : faker.commerce.productName(),
        year: faker.date
          .between(past, future)
          .getFullYear(),
        monthlyAmount: monthlyAmount,
        maxAmount: Number.parseFloat(maxAmount.toFixed(2)),
      };
      randomEntries[i] = randomEntry;
    }
    this.entryModel.insertMany(randomEntries);
  }
}
