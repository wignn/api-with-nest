import { BookmarkService } from './bookmark.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateBookmarkRequest } from './book.validation';
import { CreateBookmarkResponse } from '../model/bookmark.model';

@Controller('/api/bookmark')
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

  
  @Delete()
  async deleteBookmark(@Body() request: string): Promise<string> {
    const respone = await this.bookmarkService.deleteBookmark(request);
    return respone;
  }

  @Get(':bookid/:userid')
  async getBookmark(
    @Param('bookid') bookid: string,
    @Param('userid') userid: string
  ): Promise<any> {
    const response = await this.bookmarkService.getBookmark({ bookid, userid });
    return response;
  }

}


