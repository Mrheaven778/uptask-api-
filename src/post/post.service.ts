import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto, CreateTeamDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskStatus, User } from '@prisma/client';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @param idPost - The ID of the post.
   * @param idUser - The id od the user
   */
  async deleteUserFromTeam(idPost: string, idUser: string) {
    // check if the post exists
    try {
      const project = await this.findPostById(idPost);
      if (!project) {
        throw new BadRequestException('Project not found');
      }
      // check if the user exists
      const user = await this.prisma.user.findUnique({
        where: {
          id: idUser,
        },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      // remove this project on the user team
      await this.prisma.post.update({
        where: {
          id: idPost,
        },
        data: {
          team: {
            disconnect: {
              id: idUser,
            },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  /**
   * Retrieves the team associated with a post.
   * @param idPost - The ID of the post.
   * @returns A promise that resolves to the team object.
   */
  getTeam(idPost: string) {
    try {
      const team = this.prisma.post.findUnique({
        where: {
          id: idPost,
        },
        select: {
          team: {
            select: {
              id: true,
              email: true,
              username: true,
            },
          },
        },
      });
      if (!team) {
        throw new BadRequestException('Team not found');
      }
      return team;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Removes a team from a post.
   * @param idPost - The ID of the post.
   * @returns A string indicating the success of the operation.
   */
  async removeTeam(idPost: string, createTeamDto: CreateTeamDto) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: createTeamDto.id,
        },
        select: {
          id: true,
        },
      });
      if (!userExists) {
        throw new BadRequestException('User not found');
      }
      const postExists = await this.prisma.post.findUnique({
        where: {
          id: idPost,
        },
        select: {
          id: true,
        },
      });
      if (!postExists) {
        throw new BadRequestException('Post not found');
      }
      // remove this project on the user team
      await this.prisma.post.update({
        where: {
          id: idPost,
        },
        data: {
          team: {
            disconnect: {
              id: createTeamDto.id,
            },
          },
        },
      });

      return 'Team removed successfully';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Adds a team to a post.
   *
   * @param createTeamDto - The team data to be added.
   * @param idPost - The ID of the post to add the team to.
   * @returns A success message if the team is added successfully.
   * @throws BadRequestException if the post or user does not exist.
   */
  async addTeam(createTeamDto: CreateTeamDto, idPost: string) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: createTeamDto.id,
        },
        select: {
          id: true,
        },
      });
      const postExists = await this.prisma.post.findUnique({
        where: {
          id: idPost,
        },
      });
      // if the user is on the team return a message
      const team = await this.prisma.post.findUnique({
        where: {
          id: idPost,
        },
        select: {
          team: {
            where: {
              id: createTeamDto.id,
            },
          },
        },
      });
      team.team.forEach((user) => {
        if (user.id === createTeamDto.id) {
          throw new BadRequestException('User already on the team');
        }
      });

      if (postExists && userExists) {
        // add the user to the team
        await this.prisma.post.update({
          where: {
            id: idPost,
          },
          data: {
            team: {
              connect: {
                id: createTeamDto.id,
              },
            },
          },
        });
        return 'Team added successfully';
      }

      if (!postExists) {
        throw new BadRequestException('Post not found');
      }
      if (!userExists) {
        throw new BadRequestException('User not found');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Finds a team based on the provided parameters.
   * @param idPost - The ID of the post.
   * @param user - The user object.
   * @param createTeamDto - The DTO object containing the team details.
   * @returns The user object if found, otherwise throws a BadRequestException.
   */
  async findTeam(createTeamDto: CreateTeamDto) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          email: createTeamDto.email,
        },
        select: {
          id: true,
          email: true,
          username: true,
        },
      });
      if (!userExists) {
        throw new BadRequestException('User not found');
      }
      return userExists;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Updates the status of a task.
   * @param idPost - The ID of the post.
   * @param idTask - The ID of the task.
   * @param taskStatus - The new status of the task.
   * @throws BadRequestException if the task with the given ID is not found.
   */
  async updateTaskStatus(
    idPost: string,
    idTask: string,
    taskStatus: TaskStatus,
    userId: string,
  ) {
    await this.findPostById(idPost);
    const task = await this.prisma.task.findUnique({
      where: {
        id: idTask,
      },
    });
    if (!task) {
      throw new BadRequestException(`Task with ID ${idTask} not found`);
    }
    if (taskStatus === 'pending') {
      userId = null;
    }
    await this.prisma.task.update({
      where: {
        id: idTask,
      },
      data: {
        taskStatus: taskStatus,
        completedById: userId,
      },
    });
  }

  /**
   * Deletes a task.
   * @param idPost idPost - The ID of the post.
   * @param idTask idTask - The ID of the task.
   * @returns The task with the given ID.
   */
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

  /**
   * Retrieves a task by its ID.
   *
   * @param idPost - The ID of the post.
   * @param idTask - The ID of the task.
   * @returns A Promise that resolves to the task object if found.
   * @throws BadRequestException if the task with the specified ID is not found.
   */
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

  /**
   * Updates a task with the specified ID in a post.
   * @param idPost - The ID of the post containing the task.
   * @param idTask - The ID of the task to update.
   * @param updateTaskDto - The data to update the task with.
   * @returns A message indicating the success of the update operation.
   * @throws BadRequestException if the task with the specified ID is not found.
   */
  async updateTask(
    idPost: string,
    idTask: string,
    updateTaskDto: CreateTaskDto,
  ) {
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

  /**
   * Retrieves the tasks associated with a post.
   *
   * @param idPost - The ID of the post.
   * @returns A promise that resolves to an array of tasks.
   * @throws BadRequestException if the post with the given ID is not found.
   */
  async getTask(idPost: string, user: User) {
    try {
      const post = await this.prisma.post.findUnique({
        where: {
          id: idPost,
          // managerId: user.id,
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
        include: {
          completedBy: true,
        }
      });
      return tasks;
      
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Creates a new task for a post.
   *
   * @param createTaskDto - The data for creating the task.
   * @param idPost - The ID of the post to which the task belongs.
   * @returns A string indicating the success of the task creation.
   */
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

  /**
   * Creates a new post.
   *
   * @param createPostDto - The data for creating the post.
   * @param user - The user creating the post.
   * @returns The newly created post.
   * @throws BadRequestException if there is an error creating the post.
   */
  async create(createPostDto: CreatePostDto, user: User) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      const post = await this.prisma.post.create({
        data: {
          title: createPostDto.title,
          content: createPostDto.content,
          clientName: createPostDto.clientName,
          managerId: user.id,
        },
      });

      return post;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Retrieves all posts from the database but .
   *
   * @returns {Promise<Post[]>} A promise that resolves to an array of posts.
   */
  async findAll(user: User) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
      if (!userExists) {
        throw new BadRequestException('User not found');
      }
      const post = await this.prisma.post.findMany({
        where: {
          OR: [
            {
              managerId: user.id,
            },
            {
              team: {
                some: {
                  id: user.id,
                },
              },
            },
          ],
        },
        include: {
          tasks: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return post;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Finds a post by its ID.
   *
   * @param id - The ID of the post to find.
   * @returns A Promise that resolves to the found post.
   * @throws BadRequestException if the post is not found.
   */
  async findOne(id: string, user: User) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!userExists) {
      throw new BadRequestException('User not found');
    }
    const post = await this.prisma.post.findUnique({
      where: { 
        id: id,
        OR: [
          {
            managerId: user.id,
          },
          {
            team: {
              some: {
                id: user.id,
              },
            },
          },
        ],
       },
      include: {
        tasks: true,
      },
    });

    if (!post) {
      throw new BadRequestException('Post not found');
    }
    return post;
  }

  /**
   * Updates a post with the specified ID.
   *
   * @param id - The ID of the post to update.
   * @param updatePostDto - The data to update the post with.
   * @returns An object containing a message and the updated post.
   * @throws BadRequestException if an error occurs during the update process.
   */
  async update(id: string, updatePostDto: UpdatePostDto, user: User) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    try {
      const postExists = await this.prisma.post.findUnique({
        where: { id: id },
      });
      const newPost = await this.prisma.post.update({
        where: { id: id, managerId: user.id },
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

  /**
   * Removes a post by its ID.
   * If the post exists, it will be deleted along with any associated tasks.
   * @param id - The ID of the post to be removed.
   * @returns A message indicating the post has been deleted, along with the deleted post object.
   * @throws BadRequestException if the post does not exist.
   */
  async remove(id: string, user: User) {
    const userExists = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
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
    if (task) {
      await this.prisma.task.deleteMany({
        where: {
          postId: id,
        },
      });
    }

    const post = await this.prisma.post.delete({
      where: { id: id, managerId: user.id },
    });
    return { message: 'Post deleted', post: post };
  }

  /**
   * Finds a post by its ID.
   * @param id - The ID of the post to find.
   * @returns The found post.
   * @throws BadRequestException if the post with the specified ID is not found.
   */
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
