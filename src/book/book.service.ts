import {
  CreateBookRequest,
  CreateBookResponse,
  updateBookRequest,
} from './../model/book.model';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validate.service';
import { Logger } from 'winston';
import { BookValidation } from './book.validation';
import { ZodError } from 'zod';
import { error } from 'console';

@Injectable()
export class BookService {
  constructor(
    private ValidationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async registerBook(request: CreateBookRequest): Promise<CreateBookResponse> {
    this.logger.info(`Registering book ${JSON.stringify(request)}`);
    const CreateBookRequest: CreateBookRequest =
      this.ValidationService.validate(BookValidation.CREATE, request);

    const totalBookWithSameTitle = await this.prismaService.book.count({
      where: {
        title: CreateBookRequest.title,
      },
    });

    if (totalBookWithSameTitle != 0) {
      throw new HttpException('Book already exists', 400);
    }

    const book = await this.prismaService.book.create({
      data: CreateBookRequest,
    });

    return {
      id: book.id,
      title: book.title,
      description: book.description,
      author: book.author,
    };
  }

  async findByQuery(request: string): Promise<any> {
    this.logger.info(`Finding book ${request}`);
    const book = await this.prismaService.book.findFirst({
      where: {
        OR: [
          {
            id: {
              contains: request,
            },
          },
          {
            title: {
              contains: request,
            },
          },
          {
            author: {
              contains: request,
            },
          },
        ],
      },
      include: {
        Chapter: true,
      },
    });

    if (!book) {
      throw new error(`User with id ${book} not found`);
    }

    return book;
  }

  async updateBook(id: string ,request: CreateBookRequest) {
    this.logger.info(`Updating book ${JSON.stringify(request)}`);
    const updateBookRequest: updateBookRequest =
      this.ValidationService.validate(BookValidation.UPDATE, request);

    const book = await this.prismaService.book.findUnique({
      where: { id: updateBookRequest.id },
    });

    if (!book) {
      throw new HttpException('Book not found', 400);
    }

    await this.prismaService.book.update({
      where: { id: updateBookRequest.id },
      data: updateBookRequest,
    });

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      cover: book.cover,
      asset: book.asset,
      
    };
  }

  async deleteBook(request: string) {
    this.logger.info(`Deleting book ${request}`);
    const book = await this.prismaService.book.findUnique({
      where: { id: request },
    });

    if (!book) {
      throw new HttpException('Book not found', 400);
    }

    await this.prismaService.book.delete({
      where: { id: request },
    });

    return 'Book deleted';
  }
}
