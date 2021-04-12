import { Model, Types } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Account, AccountDocument } from './account.schema';
import {
  CreateAccountInput,
  GetAccountInput,
  UpdateAccountInput,
} from './account.input';

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

  async getAccountById(_id: Types.ObjectId): Promise<Account> {
    this.logger.log(`getting account with id ${_id}`);
    return this.accountModel.findById(_id).exec();
  }

  async getAccounts(getAccountInput: GetAccountInput): Promise<Account[]> {
    this.logger.log(`getting all accounts`);
    return this.accountModel
      .find({ ...getAccountInput }, null, { sort: { type: 1 } })
      .exec();
  }

  async getAccountsByUserId(userId: string): Promise<Account[]> {
    this.logger.log(`getting all accounts for ${userId}`);
    return this.accountModel.find({ userId: userId }, null).exec();
  }

  async updateAccount(
    updateAccountInput: UpdateAccountInput,
  ): Promise<Account> {
    this.logger.log(`updating ${updateAccountInput._id}`);
    return this.accountModel
      .findByIdAndUpdate(updateAccountInput._id, updateAccountInput, {
        useFindAndModify: false,
      })
      .exec();
  }

  async deleteAccount(_id: Types.ObjectId): Promise<Account> {
    this.logger.log(`deleting ${_id}`);
    return this.accountModel
      .findByIdAndDelete(_id, {
        useFindAndModify: false,
      })
      .exec();
  }
}
