import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { Entry } from './entry.schema';
import { EntryService } from './entry.service';
import {
  CreateEntryInput,
  GetEntryDateFilterInput,
  GetEntryInput,
  UpdateEntryInput,
} from './entry.input';

@Resolver(() => Entry)
export class EntryResolver {
  constructor(private entryService: EntryService) {}

  @Query(() => Entry)
  async entry(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.entryService.getEntryById(_id);
  }

  @Query(() => [Entry])
  async entries(
    @Args('payload', { nullable: true }) payload?: GetEntryInput,
    @Args('filter', { nullable: true }) filter?: GetEntryDateFilterInput,
  ) {
    return this.entryService.getEntries(payload, filter);
  }

  @Mutation(() => Entry)
  async createEntry(@Args('payload') payload: CreateEntryInput) {
    return this.entryService.createEntry(payload);
  }

  @Mutation(() => Entry)
  async updateEntry(@Args('payload') payload: UpdateEntryInput) {
    return this.entryService.updateEntry(payload);
  }

  @Mutation(() => Entry)
  async deleteEntry(@Args('_id', { type: () => ID }) _id: Types.ObjectId) {
    return this.entryService.deleteEntry(_id);
  }
}
