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
import { CreateEntryInput, UpdateEntryInput } from './entry.input';
import { EntryService } from './entry.service';

@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Post()
  @ApiTags('Entry')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an entry' })
  @ApiBody({ type: CreateEntryInput })
  @ApiCreatedResponse({})
  async createUser(@Body() createEntryInput: CreateEntryInput) {
    return await this.entryService.createEntry(createEntryInput);
  }

  @Put()
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an entry by id ( all params )' })
  @ApiBody({ type: UpdateEntryInput })
  @ApiOkResponse({})
  async updateEntry(@Body() updateEntryInput: UpdateEntryInput) {
    return await this.entryService.updateEntry(updateEntryInput);
  }

  @Delete(':id')
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an entry by id' })
  @ApiParam({ name: 'id', description: 'id of entry' })
  @ApiOkResponse({})
  async deleteEntry(@Param('id') id: Types.ObjectId) {
    return await this.entryService.deleteEntry(id);
  }

  @Delete()
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete all entries' })
  @ApiOkResponse({})
  async deleteAllEntry() {
    return await this.entryService.deleteAllEntries();
  }
}
