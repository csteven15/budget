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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateEntryDto, UpdateEntryDto } from './dtos';
import { EntryService } from './entry.service';

@Controller('entry')
export class EntryController {
  constructor(private readonly entryService: EntryService) {}

  @Get()
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all entries' })
  @ApiOkResponse({})
  async getAllUsers() {
    return await this.entryService.getAllEntries();
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
  @ApiCreatedResponse({})
  async createUser(@Body() createEntryDto: CreateEntryDto) {
    return await this.entryService.createEntry(createEntryDto);
  }

  @Put(':id')
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a entry by id ( all params )' })
  @ApiParam({ name: 'id', description: 'id of entry' })
  @ApiOkResponse({})
  async updateEntry(
    @Param('id') id: string,
    @Body() updateEntryDto: UpdateEntryDto,
  ) {
    return await this.entryService.updateEntry(id, updateEntryDto);
  }

  @Delete(':id')
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a entry by id' })
  @ApiParam({ name: 'id', description: 'id of entry' })
  @ApiOkResponse({})
  async deleteEntry(@Param('id') id: string) {
    return await this.entryService.deleteEntry(id);
  }

  @Get('util/:uid/:numEntries/:inputType')
  @ApiTags('Entry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'mock data given a user id' })
  @ApiOkResponse({})
  async mockData(
    @Param('uid') uid: string,
    @Param('numEntries') numEntries: number,
    @Param('inputType') inputType: number,
  ) {
    this.entryService.fakeEntries(uid, numEntries, inputType);
  }
}
