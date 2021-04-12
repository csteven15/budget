import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { Amount } from './amount.schema';
import { AmountService } from './amount.service';
import {
  CreateAmountInput,
  GetAmountInput,
  UpdateAmountInput,
} from './amount.input';

@Resolver(() => Amount)
export class AmountResolver {
  constructor(private amountService: AmountService) {}

  @Query(() => Amount)
  async amount(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.amountService.getAmountById(_id);
  }

  @Query(() => [Amount])
  async amounts(@Args('filters', { nullable: true }) filters?: GetAmountInput) {
    return this.amountService.getAmounts(filters);
  }

  @Mutation(() => Amount)
  async createAmount(@Args('payload') payload: CreateAmountInput) {
    return this.amountService.createAmount(payload);
  }

  @Mutation(() => Amount)
  async updateAmount(@Args('payload') payload: UpdateAmountInput) {
    return this.amountService.updateAmount(payload);
  }

  @Mutation(() => Amount)
  async deleteAmount(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.amountService.deleteAmount(_id);
  }
}
