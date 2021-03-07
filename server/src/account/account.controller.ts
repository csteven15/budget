import {
  Controller,
  Get,
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

  @Get()
  @ApiTags('Account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiOkResponse({})
  async getAllUsers() {
    return await this.AccountService.getAllAccounts();
  }

  @Get(':userId')
  @ApiTags('Account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all accounts for user' })
  @ApiParam({ name: 'userId', description: 'id of user' })
  @ApiOkResponse({})
  async getAccountsByUserId(@Param() params) {
    return await this.AccountService.getAllAccountsForUser(params.userId);
  }

  @Post()
  @ApiTags('Account')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an account' })
  @ApiBody({ type: CreateAccountInput })
  @ApiCreatedResponse({})
  async createUser(@Body() createAccountInput: CreateAccountInput) {
    return await this.AccountService.createAccount(createAccountInput);
  }

  @Put(':id')
  @ApiTags('Account')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an account by id ( all params )' })
  @ApiParam({ name: 'id', description: 'id of Account' })
  @ApiBody({ type: UpdateAccountInput })
  @ApiOkResponse({})
  async updateAccount(
    @Param('id') id: Types.ObjectId,
    @Body() updateAccountInput: UpdateAccountInput,
  ) {
    return await this.AccountService.updateAccount(id, updateAccountInput);
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
