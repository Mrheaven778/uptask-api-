import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Auth } from 'src/auth/decorator/auth.decoratos';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('tasks/:taskId')
  @Auth()
  create(
    @Body() createNoteDto: CreateNoteDto,
    @Param('taskId') taskId: string,
    @GetUser() user: User,
  ) {
    return this.noteService.create(createNoteDto, taskId, user);
  }

  @Get()
  findAll() {
    return this.noteService.findAll();
  }

  @Get('/tasks/:taskId')
  @Auth()
  getTasksNotes(
    @Param('taskId') taskId: string,
  ) {
    return this.noteService.getTaskNotes( taskId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.noteService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noteService.remove(id);
  }
}
