import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { SeedModule } from './seed/seed.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [AuthModule, PostModule, SeedModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
