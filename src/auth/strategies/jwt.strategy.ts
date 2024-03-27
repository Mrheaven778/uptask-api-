import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "@prisma/client";
import { JwtPayload } from "../interfaces/jwt-payload.inteface";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const {  id } = payload;

        const user = await this.prisma.user.findFirst({
            where: {
               id: id 
            }
        });

        if (!user) {
            throw new UnauthorizedException('The users does not exist');
        }
        if (!user.isActivated) throw new UnauthorizedException('The user is not activated');

        delete user.password;
        
        return user;
    }
}