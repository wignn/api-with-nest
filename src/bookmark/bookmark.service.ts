import { Inject, Injectable } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validate.service';
import { Logger } from 'winston';
import { CreateBookmarkRequest } from './book.validation';
import {
  CreateBookmarkResponse,
  GetBookmarkRequest,
} from 'src/model/bookmark.model';

@Injectable()
export class BookmarkService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async CreateBookmark(
    request: CreateBookmarkRequest,
  ): Promise<CreateBookmarkResponse> {
    this.logger.info(`Creating bookmark ${JSON.stringify(request)}`);
    const validatedRequest = this.validationService.validate(
      CreateBookmarkRequest.CREATE,
      request,
    );
    

    const bookmark = await this.prismaService.bookMark.create({
      data: validatedRequest,
    });

    return {
      id: bookmark.id,
      bookId: bookmark.bookId,
      userId: bookmark.userId,
    };
  }

  async deleteBookmark(request: string): Promise<string> {
    this.logger.info(`Deleting bookmark ${request}`);

    await this.prismaService.bookMark.delete({
      where: {
        id: request,
      },
    });

    return 'Bookmark deleted successfully';
  }

  async getBookmark(request: GetBookmarkRequest): Promise<any> {
    this.logger.info(`Getting bookmark ${request}`);

    const bookmark = await this.prismaService.bookMark.findMany({
      where: {
        bookId: request.bookid,
        userId: request.userid,
      },
    });

    return bookmark;
  }
}
