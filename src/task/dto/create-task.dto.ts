import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
    @IsString()
    name: string;

    @IsString() 
    description: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    taskStatus: TaskStatus;
}
