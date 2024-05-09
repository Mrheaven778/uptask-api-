import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}
  async getTaskNotes(taskId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      throw new Error('Task not found');
    }
    // get the notes for the task
    return await this.prisma.note.findMany({
      where: { taskId },
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            roles: true,
            username: true,
            createdAt: true,
          },
        },
      },
    });
  }
  async create(createNoteDto: CreateNoteDto, taskId: string, user: User) {
    try {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!task) {
        throw new Error('Task not found');
      }
      return await this.prisma.note.create({
        data: {
          ...createNoteDto,
          createdAt: new Date(),
          createdBy: { connect: { id: user.id } },
          task: { connect: { id: taskId } },
        },
      });
    } catch (error: any) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id) {
    const note = this.prisma.note.delete({
      where: { id: id },
    });
    if (!note) {
      throw new Error('Note not found');
    }
    return note;
  }
}
