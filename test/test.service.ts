import { PrismaService } from '../src/common/prisma.service';
import { Injectable, Delete } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private PrismaService: PrismaService) {}

  async deleteUser() {
    await this.PrismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async createUser() {
    const hashedPassword = await bcrypt.hash('test123', 10);
    await this.PrismaService.user.create({
      data: {
        username: 'test',
        name: 'test1',
        password: hashedPassword,
        email: 'test1',
      },
    });
  }

  async deletebook() {
    await this.PrismaService.book.deleteMany({
      where: {
        title: 'test',
      },
    });
  }
  async createBook() {
    await this.PrismaService.book.create({
      data: {
        title: 'test',
        description: 'test',
        author: 'test',
        cover: 'test',
      },
    });
  }

  async DeleteGenre() {
    await this.PrismaService.genre.deleteMany({
      where: {
        title: 'test',
      },
    });
  }

  async Token() {
    const user = await this.PrismaService.user.findUnique({
      where: {
        username: 'wignn',
      },
    });
  
    if (!user) {
      throw new Error("User with username 'test' not found.");
    }
  
    return user.token
  
  }
  

}