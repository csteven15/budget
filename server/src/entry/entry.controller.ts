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
import {
  CreateEntryInput,
  GetEntryInput,
  UpdateEntryInput,
} from './entry.input';
import { EntryService } from './entry.service';

@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Get(':userId')
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all entries for user' })
  @ApiParam({ name: 'userId', description: 'id of user' })
  @ApiOkResponse({})
  async getEntriesByUserId(@Param() params) {
    return await this.entryService.getAllEntriesForUser(params.userId);
  }

  @Post()
  @ApiTags('Entry')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an entry' })
  @ApiBody({ type: CreateEntryInput })
  @ApiCreatedResponse({})
  async createUser(@Body() createEntryInput: CreateEntryInput) {
    return await this.entryService.createEntry(createEntryInput);
  }

  @Put(':id')
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an entry by id ( all params )' })
  @ApiParam({ name: 'id', description: 'id of entry' })
  @ApiBody({ type: UpdateEntryInput })
  @ApiOkResponse({})
  async updateEntry(
    @Param('id') id: Types.ObjectId,
    @Body() updateEntryInput: UpdateEntryInput,
  ) {
    return await this.entryService.updateEntry(id, updateEntryInput);
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
