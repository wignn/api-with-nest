import { BookmarkService } from './bookmark.service';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateBookmarkRequest } from './book.validation';
import { CreateBookmarkResponse } from 'src/model/bookmark.model';

@Controller('bookmark')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Post()
  @HttpCode(200)
  async createBookmark(
    @Body() request: CreateBookmarkRequest,
  ): Promise<CreateBookmarkResponse> {
    const respone = await this.bookmarkService.CreateBookmark(request);
    return respone;
  }

  
}


