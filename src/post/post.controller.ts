import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Auth } from 'src/auth/decorator/auth.decoratos';
import { CreateTaskDto } from 'src/task/dto/create-task.dto';
import { TaskStatus } from '@prisma/client';
import { UpdateTaskDto } from 'src/task/dto/update-task.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Patch(':idPost/task/:idTask/status')
  updateTaskStatus(@Param('idPost') idPost: string, @Param('idTask') idTask: string, @Body() UpdateTaskDto: UpdateTaskDto){
    return this.postService.updateTaskStatus(idPost, idTask, UpdateTaskDto.taskStatus );
  }

  @Delete(':idPost/task/:idTask')
  deleteTask(@Param('idPost') idPost: string, @Param('idTask') idTask: string){
    return this.postService.deleteTask(idPost, idTask);
  }

  @Get(':idPost/task/:idTask')
  getTaskById(@Param('idPost') idPost: string, @Param('idTask') idTask: string){
    return this.postService.getTaskById(idPost, idTask);
  }

  @Patch(':idPost/task/:idTask')
  updateTask(@Param('idPost') idPost: string, @Param('idTask') idTask: string, @Body() updateTaskDto: CreateTaskDto){
    return this.postService.updateTask(idPost, idTask, updateTaskDto);
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto){
    return this.postService.create(createPostDto);
  }


  @Get(':idPost/task')
  getTask(@Param('idPost') idPost: string){
    return this.postService.getTask(idPost);
  }


  @Post(':idPost/task')
  createTask(@Body() createTaskDto: CreateTaskDto, @Param('idPost') idPost: string){
    return this.postService.createTask(createTaskDto, idPost);
  }

  @Get()
  // @Auth()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
