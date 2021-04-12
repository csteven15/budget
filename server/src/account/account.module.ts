import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountService } from './account.service';
import { Account, AccountSchema } from './account.schema';
import { AccountResolver } from './account.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  providers: [AccountService, AccountResolver],
  exports: [AccountModule],
})
export class AccountModule {}
