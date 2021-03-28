import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import {
  CreateAccountInput,
  GetAccountInput,
  UpdateAccountInput,
} from './account.input';
import { Account } from './account.schema';
import { AccountService } from './account.service';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private accountService: AccountService) {}

  @Query(() => Account)
  async account(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.accountService.getAccountById(_id);
  }

  @Query(() => [Account])
  async accounts(
    @Args('payload', { nullable: true }) payload: GetAccountInput,
  ) {
    return this.accountService.getAccounts(payload);
  }

  @Mutation(() => Account)
  async createAccount(@Args('payload') payload: CreateAccountInput) {
    return this.accountService.createAccount(payload);
  }

  @Mutation(() => Account)
  async updateAccount(@Args('payload') payload: UpdateAccountInput) {
    return this.accountService.updateAccount(payload);
  }

  @Mutation(() => Account)
  async deleteAccount(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.accountService.deleteAccount(_id);
  }
}
