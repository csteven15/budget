import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Put,
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
import { CreateAmountInput, UpdateAmountInput } from './amount.input';
import { AmountService } from './amount.service';

@Controller('amount')
export class AmountController {
  constructor(private readonly amountService: AmountService) {}

  @Post()
  @ApiTags('Amount')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an amount' })
  @ApiBody({ type: CreateAmountInput })
  @ApiCreatedResponse({})
  async createUser(@Body() CreateAmountInput: CreateAmountInput) {
    return await this.amountService.createAmount(CreateAmountInput);
  }

  @Put()
  @ApiTags('Amount')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an amount by id' })
  @ApiBody({ type: UpdateAmountInput })
  @ApiOkResponse({})
  async updateEntry(@Body() updateAmountInput: UpdateAmountInput) {
    return await this.amountService.updateAmount(updateAmountInput);
  }

  @Delete(':id')
  @ApiTags('Amount')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a amount by id' })
  @ApiParam({ name: 'id', description: 'id of amount' })
  @ApiOkResponse({})
  async deleteEntry(@Param('_id') _id: Types.ObjectId) {
    return await this.amountService.deleteAmount(_id);
  }

  @Delete()
  @ApiTags('Amount')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all amounts' })
  @ApiOkResponse({})
  async deleteAllAmounts() {
    return await this.amountService.deleteAllAmounts();
  }
}
