import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Types } from 'mongoose';

import { Entry } from './entry.schema';
import { EntryService } from './entry.service';
import {
  CreateEntryInput,
  GetEntryInput,
  UpdateEntryInput,
} from './entry.input';

@Resolver(() => Entry)
export class EntryResolver {
  constructor(private entryService: EntryService) {}

  @Query(() => Entry)
  async entry(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    return this.entryService.getEntryById(_id);
  }

  @Query(() => [Entry])
  async entries(@Args('filters', { nullable: true }) filters?: GetEntryInput) {
    return this.entryService.getEntry(filters);
  }

  @Mutation(() => Entry)
  async createEntry(@Args('payload') payload: CreateEntryInput) {
    return this.entryService.createEntry(payload);
  }



}
