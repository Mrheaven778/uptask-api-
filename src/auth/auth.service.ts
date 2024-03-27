import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.inteface';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private readonly jwtService: JwtService) { }
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: {
        email: email
      },
      select: {
        id: true,
        email: true,
        password: true,
      }
    });
    if (!user) {
      throw new UnauthorizedException('The email does not exist');
    }
    if (bcrypt.compareSync(password, user.password) === false) {
      throw new UnauthorizedException('The password is incorrect');
    }
    return {
      message: 'Login successful',
      data:{
        token: this.getJwtToken({
          id: user.id
        }),
        id: user.id,
        email: loginUserDto.email,
        password: loginUserDto.password
      }
    };
  }

  async create(createUserDto: CreateUserDto) {
    try {
      createUserDto.password = await bcrypt.hashSync(createUserDto.password, 10);
      createUserDto.email = createUserDto.email.toLowerCase().trim();

      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          username: createUserDto.username,
          password: createUserDto.password
        },
        select: {
          id: true,
          email: true,
          username: true
        }
      });

      return {
        message: 'User created successfully',
        data: {
          token: this.getJwtToken({
            id: user.id
          }),
          email: createUserDto.email,
          username: createUserDto.username,
          id: createUserDto.id
        }
      };
    } catch (error) {
      this.handelError(error);
    }
  }

    async checkAuthStatus( user: User ){
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }


  // metodos privados
  /**
   * This method generates a jwt token
   * @param payload this is the payload to be used in generating the token
   */
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;

  }

  /**
   * This method handles the error object and throws a custom error
   * @param error this is the error object
   */
  private handelError(error: any): never {
    if (error.code === 'P2002') {
      if (error.meta.target.includes('email')) {
        throw new BadRequestException('Email already exists');
      }
      if (error.meta.target.includes('username')) {
        throw new BadRequestException('Username already exists');
      }
    }
    throw new InternalServerErrorException('Check the data and try again');
  }
}
