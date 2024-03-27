import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, TaskStatus } from '@prisma/client';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) { }
  
  async updateTaskStatus(idPost: string, idTask: string, taskStatus: TaskStatus) {
    await this.findPostById(idPost);
    const task = await this.prisma.task.findUnique({
      where: {
        id: idTask,
      },
    });
    if (!task) {
      throw new BadRequestException(`Task with ID ${idTask} not found`);
    }
    await this.prisma.task.update({
      where: {
        id: idTask,
      },
      data: {
        taskStatus: taskStatus,
      },
    });
  }
  async deleteTask(idPost: string, idTask: string) {
    await this.findPostById(idPost);
    const task = await this.prisma.task.findUnique({
      where: {
        id: idTask,
      },
    });
    if (!task) {
      throw new BadRequestException(`Task with ID ${idTask} not found`);
    }
    await this.prisma.task.delete({
      where: {
        id: idTask,
      },
    });
    return 'Task deleted successfully';
  }
  async getTaskById(idPost: string, idTask: string) {
    // check if the post exists
    await this.findPostById(idPost);

    // check if the task exists
    const task = await this.prisma.task.findUnique({
      where: {
        id: idTask,
      },
    });
    if (!task) {
      throw new BadRequestException(`Task with ID ${idTask} not found`);
    }
    return task;
  }

  async updateTask(idPost: string, idTask: string, updateTaskDto: CreateTaskDto) {
    await this.findPostById(idPost);

    // check if the task exists
    const task = await this.prisma.task.findUnique({
      where: {
        id: idTask,
      },
    });
    if (!task) {
      throw new BadRequestException(`Task with ID ${idTask} not found`);
    }
    // update the task
    await this.prisma.task.update({
      where: {
        id: idTask,
      },
      data: {
        ...updateTaskDto,
      },
    });
    return 'Task updated successfully';
  }
  async getTask(idPost: string) {
    // check if the post exists
    const post = await this.prisma.post.findUnique({
      where: {
        id: idPost,
      },
    });
    if (!post) {
      throw new BadRequestException(`Post with ID ${idPost} not found`);
    }
    // get this project tasks
    const tasks = await this.prisma.task.findMany({
      where: {
        postId: idPost,
      },
    });
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, idPost: string) {
    // check if the post exists
    await this.findPostById(idPost);

    await this.prisma.task.create({
      data: {
        ...createTaskDto,
        post: {
          connect: {
            id: idPost,
          },
        },
      },
    });
    return 'Task created successfully';
  }

  async create(createPostDto: CreatePostDto) {
    try {
      const post = await this.prisma.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          clientName: createPostDto.clientName,
        }
      });

      return post;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    const post = await this.prisma.post.findMany({
      include: {
        tasks: true,
      },
    });
    return post;
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: id },
      include: {
        tasks: true,
      },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const postExists = await this.prisma.post.findUnique({
        where: { id: id },
      });
      const newPost = await this.prisma.post.update({
        where: { id: id },
        data: {
          title: updatePostDto.title,
          content: updatePostDto.content,
          clientName: updatePostDto.clientName,
        },
      });

      return { message: 'Post updated', post: newPost };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    // Check if post exists
    const postExists = await this.prisma.post.findUnique({
      where: { id: id },
    });
    if (!postExists) {
      throw new BadRequestException('Post not found');
    }
    const task = await this.prisma.task.findMany({
      where: {
        postId: id,
      },
    });
    if (task){
      await this.prisma.task.deleteMany({
        where: {
          postId: id,
        },
      });
    }

    const post = await this.prisma.post.delete({
      where: { id: id },
    });
    return { message: 'Post deleted', post: post };

  }

  private async findPostById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    if (!post) {
      throw new BadRequestException(`Post with ID ${id} not found`);
    }
    return post;
  }
}
