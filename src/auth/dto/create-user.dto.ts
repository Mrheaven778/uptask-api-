import { IsEmail, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserDto {
    @MinLength(1)
    @IsOptional()
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @IsEmail()
    email: string;


    @IsOptional()
    @IsString()
    id: string;
}