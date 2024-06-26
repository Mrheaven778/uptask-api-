import { Injectable } from '@nestjs/common';
// import { generateSeedData } from './data/seedData';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async executeSeed() {
    try {
      // await this.prisma.task.deleteMany();
      // await this.prisma.post.deleteMany();
      // await this.prisma.user.deleteMany();
      // const dataSeed = generateSeedData();
      // await this.prisma.user.createMany({
      //   data: dataSeed.users,
      // });
      // await this.prisma.post.createMany({
      //   data: dataSeed.posts,
      // });
      // await this.prisma.task.createMany({
      //   data: dataSeed.tasks,
      // });
      return 'Seed executed successfully!';
    } catch (error) {
      console.error(error);
    }
  }
}
