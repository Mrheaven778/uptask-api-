import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [NoteController],
  providers: [NoteService],
  imports: [AuthModule, PrismaModule],
})
export class NoteModule {}
