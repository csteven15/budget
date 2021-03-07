import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CreateAccountInput, UpdateAccountInput } from './account.input';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly AccountService: AccountService) {}

  @Post()
  @ApiTags('Account')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an account' })
  @ApiBody({ type: CreateAccountInput })
  @ApiCreatedResponse({})
  async createUser(@Body() createAccountInput: CreateAccountInput) {
    return await this.AccountService.createAccount(createAccountInput);
  }

  @Put()
  @ApiTags('Account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an account by id' })
  @ApiBody({ type: UpdateAccountInput })
  @ApiOkResponse({})
  async updateAccount(@Body() updateAccountInput: UpdateAccountInput) {
    return await this.AccountService.updateAccount(updateAccountInput);
  }

  @Delete(':id')
  @ApiTags('Account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a Account by id' })
  @ApiParam({ name: 'id', description: 'id of Account' })
  @ApiOkResponse({})
  async deleteAccount(@Param('id') id: Types.ObjectId) {
    return await this.AccountService.deleteAccount(id);
  }
}
