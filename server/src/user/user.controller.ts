import { Controller, Get, Query, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags
} from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiTags('User')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({})
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiTags('User')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'id of user' })
  @ApiOkResponse({})
  async getOneUser(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Post()
  @ApiTags('User')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a user' })
  @ApiCreatedResponse({})
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiTags('User')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a user by id ( all params )' })
  @ApiParam({ name: 'id', description: 'id of user' })
  @ApiOkResponse({})
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.updateUser(id, updateUserDto);
  }
}