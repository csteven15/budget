import { Controller, Get, Query, Post, Body, Put, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/login")
  @ApiTags('Auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authorize user' })
  @ApiOkResponse({})
  async auth(@Body() loginDto: LoginDto) {
    return await this.authService.validateUser(loginDto);
  }

}