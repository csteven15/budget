import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { comparePassword } from '../util/password';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dtos';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) { }

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.userService.getUserByEmail(loginDto.email);

    if (user && (await comparePassword(loginDto.password, user.password))) {
      return user;
    }

    return null;
  }
}