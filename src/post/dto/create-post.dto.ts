import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;
  @IsString()
  content: string;

  @IsString()
  clientName: string;

  @IsString()
  @IsOptional()
  managerId: string;
}

export class CreateTeamDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  id: string;
}
