import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account, AccountDocument } from './schemas/account.schema';
import { CreateAccountDto, UpdateAccountDto } from './dtos';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectModel(Account.name) private AccountModel: Model<AccountDocument>,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {
    const Account = new this.AccountModel(createAccountDto);
    this.logger.log(`created account ${Account._id}`);
    return Account.save();
  }

  async getAllAccounts(): Promise<Account[]> {
    this.logger.log(`getting all accounts`);
    return this.AccountModel.find().exec();
  }

  async getAllAccountsForUser(uid: string): Promise<Account[]> {
    this.logger.log(`getting all accounts for ${uid}`);
    return this.AccountModel.find({ uid: uid }, null).exec();
  }

  async updateAccount(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    this.logger.log(`updating ${id}`);
    return this.AccountModel.findByIdAndUpdate(id, updateAccountDto, {
      useFindAndModify: false,
    }).exec();
  }

  async deleteAccount(id: string): Promise<Account> {
    this.logger.log(`deleting ${id}`);
    return this.AccountModel.findByIdAndDelete(id, {
      useFindAndModify: false,
    }).exec();
  }
}
