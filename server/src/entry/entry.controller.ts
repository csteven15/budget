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
import {
  CreateEntryInputs,
  GetEntryInputs,
  UpdateEntryInputs,
} from './entry.inputs';
import { EntryService } from './entry.service';

@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Get()
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all entries' })
  @ApiOkResponse({})
  async getAllEntries() {
    return await this.entryService.getAllEntries();
  }

  @Post('filter')
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all entries' })
  @ApiBody({ type: GetEntryInputs })
  @ApiOkResponse({})
  async getAllEntriesFilter(@Body() getEntryInputs: GetEntryInputs) {
    console.log('params', getEntryInputs);
    return await this.entryService.getAllEntriesFilter(getEntryInputs);
  }

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
  @ApiBody({ type: CreateEntryInputs })
  @ApiCreatedResponse({})
  async createUser(@Body() createEntryInputs: CreateEntryInputs) {
    return await this.entryService.createEntry(createEntryInputs);
  }

  @Put(':id')
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an entry by id ( all params )' })
  @ApiParam({ name: 'id', description: 'id of entry' })
  @ApiBody({ type: UpdateEntryInputs })
  @ApiOkResponse({})
  async updateEntry(
    @Param('id') id: string,
    @Body() updateEntryInputs: UpdateEntryInputs,
  ) {
    return await this.entryService.updateEntry(id, updateEntryInputs);
  }

  @Delete(':id')
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete an entry by id' })
  @ApiParam({ name: 'id', description: 'id of entry' })
  @ApiOkResponse({})
  async deleteEntry(@Param('id') id: string) {
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
