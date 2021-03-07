import { Model, Types } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account, AccountDocument } from './account.schema';
import { CreateAccountInput, UpdateAccountInput } from './account.input';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async createAccount(
    createAccountInput: CreateAccountInput,
  ): Promise<Account> {
    const Account = new this.accountModel(createAccountInput);
    this.logger.log(`created account ${Account._id}`);
    return Account.save();
  }

  async getAllAccounts(): Promise<Account[]> {
    this.logger.log(`getting all accounts`);
    return this.accountModel.find().exec();
  }

  async getAllAccountsForUser(userId: Types.ObjectId): Promise<Account[]> {
    this.logger.log(`getting all accounts for ${userId}`);
    return this.accountModel.find({ userId: userId }, null).exec();
  }

  async updateAccount(
    id: Types.ObjectId,
    updateAccountInput: UpdateAccountInput,
  ): Promise<Account> {
    this.logger.log(`updating ${id}`);
    return this.accountModel
      .findByIdAndUpdate(id, updateAccountInput, {
        useFindAndModify: false,
      })
      .exec();
  }

  async deleteAccount(id: Types.ObjectId): Promise<Account> {
    this.logger.log(`deleting ${id}`);
    return this.accountModel
      .findByIdAndDelete(id, {
        useFindAndModify: false,
      })
      .exec();
  }
}
