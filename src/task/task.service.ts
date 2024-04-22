import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) { }
  
  async create(createTaskDto: CreateTaskDto, postId: string) {
    // check if the post exists
    const post = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new BadRequestException(`Post with ID ${postId} not found`);
    }
    await this.prisma.task.create({
      data: {
        ...createTaskDto,
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });
    return 'Task created successfully';
  }

  async findAll() {
    return await this.prisma.task.findMany({
      include: {
        post: true,
      },
    });
    ;
  }

  async findOne(id: string) {
    // check if the task exists
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
      include: {
        post: true,
      }
    });
    if (!task) {
      throw new BadRequestException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    // check if the task exists
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });

    if (!task) {
      throw new BadRequestException(`Task with ID ${id} not found`);
    }
    await this.prisma.task.update({
      where: {
        id: id,
      },
      data: {
        ...updateTaskDto,
      },
    });

    return `The task was update #${id} `;
  }

  async remove(id: string) {
    // check if the task exists
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    if (!task) {
      throw new BadRequestException(`Task with ID ${id} not found`);
    }
    await this.prisma.task.delete({
      where: {
        id: id,
      },
    });
    return `The task was deleted #${id}`;
  }
}
