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
    const validate = await this.PrismaService.user.findFirst({
      where: {
        username: 'test',
      },
    });

    if (validate) {
      return validate;
    }
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

  async createBook() {
    const validate = await this.PrismaService.book.findFirst({
      where: {
        title: 'test',
      },
    });
    if (validate) {
      return validate;
    }

    const book = await this.PrismaService.book.create({
      data: {
        title: 'test',
        description: 'test',
        author: 'test',
        cover: 'test',
      },
    });
    return book;
  }

  async deletebook() {
    const valid = await this.PrismaService.book.findFirst({
      where: {
        title: 'test',
      },
    });

    if (valid) {
      await this.PrismaService.bookGenre.deleteMany({
        where: {
          bookId: valid.id,
        },
      });

      await this.PrismaService.book.deleteMany({
        where: {
          id: valid.id,
        },
      });
    }
  }

  async DeleteGenre() {
    const valid = await this.PrismaService.genre.findFirst({
      where: {
        title: 'test',
      },
    });

    if (valid) {
      await this.PrismaService.bookGenre.deleteMany({
        where: {
          genreId: valid.id,
        },
      });

      await this.PrismaService.genre.delete({
        where: {
          id: valid.id,
        },
      });
    }
  }

  async Token() {
    const user = await this.PrismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });

    if (!user) {
      throw new Error("User with username 'test' not found.");
    }

    return user;
  }

  async createGenre() {
    const genre = await this.PrismaService.genre.create({
      data: {
        title: 'test',
        description: 'test',
      },
    });
    return genre;
  }

  async login() {
    const user = await this.PrismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });

    if (!user) {
      await this.createUser();
    }

    await this.PrismaService.user.update({
      where: {
        username: 'test',
      },
      data: {
        token: 'test',
      },
    });

    return 'test';
  }
}
