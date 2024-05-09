import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, CreateTeamDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth } from 'src/auth/decorator/auth.decoratos';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import {  User } from '@prisma/client';
import { UpdateTaskDto } from 'src/task/dto/update-task.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { GetUser } from 'src/auth/decorator';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // * Delete a user from a team
  @Delete('/:idPost/team/:idUser')
  @Auth(ValidRoles.manager)
  deleteUserFromTeam(@Param('idPost') idPost: string, @Param('idUser') idUser: string){
    return this.postService.deleteUserFromTeam(idPost, idUser);
  }
  
  // * Get a team
  @Get('/:idPost/team')
  @Auth()
  getTeam(@Param('idPost') idPost: string) {
    return this.postService.getTeam(idPost);
  }
  // * Remove a team
  @Delete('/:idPost/team')
  @Auth(ValidRoles.manager)
  removeTeam(@Param('idPost') idPost: string, @Body() CreateTeamDto: CreateTeamDto){
    return this.postService.removeTeam(idPost, CreateTeamDto);
  }

  // * Add a team
  @Post('/:idPost/team')
  @Auth(ValidRoles.manager)
  addTeam(@Body() createTeamDto: CreateTeamDto, @Param('idPost') idPost: string){
    return this.postService.addTeam(createTeamDto, idPost);
  }

  // * Find a team
  @Post('/team/find')
  @Auth()
  findTeam(@Body() createTeamDto: CreateTeamDto) {
    return this.postService.findTeam( createTeamDto);
  }

  // * Update a task status
  @Patch(':idPost/task/:idTask/status')
  updateTaskStatus(
    @Param('idPost') idPost: string,
    @Param('idTask') idTask: string,
    @Body() UpdateTaskDto: UpdateTaskDto,
  ) {
    return this.postService.updateTaskStatus(
      idPost,
      idTask,
      UpdateTaskDto.taskStatus,
      UpdateTaskDto.completedById,
    );
  }

  // * Delete a task
  @Delete(':idPost/task/:idTask')
  @Auth()
  deleteTask(@Param('idPost') idPost: string, @Param('idTask') idTask: string) {
    return this.postService.deleteTask(idPost, idTask);
  }

  // * Get a task by id
  @Get(':idPost/task/:idTask')
  getTaskById(
    @Param('idPost') idPost: string,
    @Param('idTask') idTask: string,
  ) {
    return this.postService.getTaskById(idPost, idTask);
  }

  // * Update a task
  @Patch(':idPost/task/:idTask')
  updateTask(
    @Param('idPost') idPost: string,
    @Param('idTask') idTask: string,
    @Body() updateTaskDto: CreateTaskDto,
  ) {
    return this.postService.updateTask(idPost, idTask, updateTaskDto);
  }

  // * Create a task
  @Post(':idPost/task')
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Param('idPost') idPost: string,
  ) {
    return this.postService.createTask(createTaskDto, idPost);
  }

  // * Get all task from a project
  @Get(':idPost/task')
  @Auth()
  getTask(@Param('idPost') idPost: string, @GetUser() user: User) {
    return this.postService.getTask(idPost, user);
  }

  // * Create a projects
  @Post()
  @Auth(ValidRoles.manager)
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  // * Find all projects
  @Get()
  @Auth()
  findAll(@GetUser() user: User) {
    return this.postService.findAll(user);
  }

  // * Find a projects by id
  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string, @GetUser() user: User){
    return this.postService.findOne(id, user);
  }

  // * Update a projects by id
  @Patch(':id')
  @Auth(ValidRoles.manager)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @GetUser() user: User){
    return this.postService.update(id, updatePostDto, user);
  }

  //* Delete a projects by id
  @Delete(':id')
  @Auth(ValidRoles.manager)
  remove(@Param('id') id: string, @GetUser() user: User){
    return this.postService.remove(id, user);
  }

}
