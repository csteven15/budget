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
import { CreateAmountInputs, UpdateAmountInputs } from './amount.inputs';
import { AmountService } from './amount.service';

@Controller('amount')
export class AmountController {
  constructor(private readonly amountService: AmountService) {}

  @Get()
  @ApiTags('Amount')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all amounts' })
  @ApiOkResponse({})
  async getAllUsers() {
    return await this.amountService.getAllAmounts();
  }

  @Get(':entryId')
  @ApiTags('Amount')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all entries for entryId' })
  @ApiParam({ name: 'entryId', description: 'id of entry' })
  @ApiOkResponse({})
  async getEntriesByUserId(@Param() params) {
    return await this.amountService.getAllAmountsForEntry(params.entryId);
  }

  @Post()
  @ApiTags('Amount')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an amount' })
  @ApiBody({ type: CreateAmountInputs })
  @ApiCreatedResponse({})
  async createUser(@Body() CreateAmountInputs: CreateAmountInputs) {
    return await this.amountService.createAmount(CreateAmountInputs);
  }

  @Put(':id')
  @ApiTags('Amount')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an amount by id ( all params )' })
  @ApiParam({ name: 'id', description: 'id of entry' })
  @ApiBody({ type: UpdateAmountInputs })
  @ApiOkResponse({})
  async updateEntry(
    @Param('id') id: string,
    @Body() UpdateAmountInputs: UpdateAmountInputs,
  ) {
    return await this.amountService.updateAmount(id, UpdateAmountInputs);
  }

  @Delete(':id')
  @ApiTags('Amount')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a amount by id' })
  @ApiParam({ name: 'id', description: 'id of amount' })
  @ApiOkResponse({})
  async deleteEntry(@Param('id') id: string) {
    return await this.amountService.deleteAmount(id);
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
