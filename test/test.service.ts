import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
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
}
