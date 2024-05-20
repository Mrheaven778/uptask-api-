import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/auth/decorator/auth.decoratos';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth()
  findOne(@GetUser() user: User) {
    return this.userService.findOne(user);
  }

  @Patch('profile')
  @Auth()
  update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user, updateUserDto);
  }

  @Patch('/profile/change-password')
  @Auth()
  changePassword(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.changePassword(user, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
