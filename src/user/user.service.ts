import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async changePassword(user: User, updateUserDto: UpdateUserDto) {
    try {
      const userExist = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          password: true,
        },
      });
      if (!userExist) {
        throw new UnauthorizedException('User not found');
      }
      if (
        bcrypt.compareSync(updateUserDto.oldPassword, userExist.password) ===
        false
      ) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }
      if (
        bcrypt.compareSync(updateUserDto.newPassword, userExist.password) ===
        true
      ) {
        throw new UnauthorizedException('No puedes usar la misma contraseña');
      }

      updateUserDto.newPassword = await bcrypt.hash(
        updateUserDto.newPassword,
        10,
      );
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: updateUserDto.newPassword,
        },
      });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async findOne(user: User) {
    try {
      const userExist = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          email: true,
          username: true,
          notes: true,
          roles: true,
          project: true,
          team: true,
        },
      });
      if (!userExist) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(user: User, updateUserDto: UpdateUserDto) {
    try {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: updateUserDto.email,
          username: updateUserDto.username,
        },
      });
      return 'User updated';
    } catch (error) {
      throw new Error(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
