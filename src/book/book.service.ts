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

@Injectable()
export class BookService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async registerBook(request: CreateBookRequest): Promise<CreateBookResponse> {
    this.logger.info(`Registering book ${JSON.stringify(request)}`);
    const validatedRequest = this.validationService.validate(BookValidation.CREATE, request);

    const totalBookWithSameTitle = await this.prismaService.book.count({
      where: {
        title: validatedRequest.title,
      },
    });

    if (totalBookWithSameTitle !== 0) {
      throw new HttpException('Book already exists', 400);    
    }

    const book = await this.prismaService.book.create({
      data: validatedRequest,
    });

    return {
      id: book.id,
      title: book.title,
      description: book.description,
      author: book.author,
    };
  }

  async getAll(): Promise<CreateBookResponse[]> {
    this.logger.info('Getting all books');
    return await this.prismaService.book.findMany({
      include: {
        Chapter: true,
      },
    });
  }

  async findByQuery(request: string): Promise<any> {
    this.logger.info(`Finding book ${request}`);

    const book = await this.prismaService.book.findFirst({
      where: {
        OR: [
          { id: { contains: request } },
          { title: { contains: request } },
          { author: { contains: request } },
        ],
      },
      include: { Chapter: true },
    });

    if (!book) {
      throw new HttpException(`Book with query ${request} not found`, 404);
    }
    return book;
  }

  async updateBook(id: string, request: updateBookRequest) {
    this.logger.info(`Updating book ${JSON.stringify(request)}`);
    const validatedRequest = this.validationService.validate(BookValidation.UPDATE, request);

    const book = await this.prismaService.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    const updatedBook = await this.prismaService.book.update({
      where: { id },
      data: validatedRequest,
    });

    return {
      id: updatedBook.id,
      title: updatedBook.title,
      author: updatedBook.author,
      description: updatedBook.description,
      cover: updatedBook.cover,
      asset: updatedBook.asset,
    };
  }

  async deleteBook(request: string) {
    this.logger.info(`Deleting book ${request}`);
    const book = await this.prismaService.book.findUnique({
      where: { id: request },
    });

    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    await this.prismaService.book.delete({
      where: { id: request },
    });

    return { message: 'Book deleted' };
  }
}
