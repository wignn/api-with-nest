import { CreateBookRequest, CreateBookResponse } from './../model/book.model';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validate.service';
import { Logger } from 'winston';
import { BookValidation } from './book.validation';

@Injectable()
export class BookService {
  constructor(
    private ValidationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async registerBook(
    request: CreateBookRequest,
  ): Promise<CreateBookResponse> {
    this.logger.info(`Registering book ${JSON.stringify(request)}`);
    const CreateBookRequest: CreateBookRequest =
      this.ValidationService.validate(BookValidation.CREATE, request);
  
    const totalBookWithSameTitle = await this.prismaService.book.count({
        where: {
            title: CreateBookRequest.title,
        },
    })


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
    }
  
}}
