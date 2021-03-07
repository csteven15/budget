import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account, AccountDocument } from './account.schema';
import { CreateAccountInputs, UpdateAccountInputs } from './account.inputs';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async createAccount(
    createAccountInputs: CreateAccountInputs,
  ): Promise<Account> {
    const Account = new this.accountModel(createAccountInputs);
    this.logger.log(`created account ${Account._id}`);
    return Account.save();
  }

  async getAllAccounts(): Promise<Account[]> {
    this.logger.log(`getting all accounts`);
    return this.accountModel.find().exec();
  }

  async getAllAccountsForUser(uid: string): Promise<Account[]> {
    this.logger.log(`getting all accounts for ${uid}`);
    return this.accountModel.find({ uid: uid }, null).exec();
  }

  async updateAccount(
    id: string,
    updateAccountInputs: UpdateAccountInputs,
  ): Promise<Account> {
    this.logger.log(`updating ${id}`);
    return this.accountModel
      .findByIdAndUpdate(id, updateAccountInputs, {
        useFindAndModify: false,
      })
      .exec();
  }

  async deleteAccount(id: string): Promise<Account> {
    this.logger.log(`deleting ${id}`);
    return this.accountModel
      .findByIdAndDelete(id, {
        useFindAndModify: false,
      })
      .exec();
  }
}
