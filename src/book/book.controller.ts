import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookRequest, CreateBookResponse } from '../model/book.model';
import { WebResponse } from '../model/web.model';
import { BookGuard } from './guards/book.guard';

@Controller('/api/books')
export class BookController {
  constructor(private bookService: BookService) {}

  
  @UseGuards(BookGuard)
  @Post()
  @HttpCode(200)
  async registerBook(
    @Body() request: CreateBookRequest,
  ): Promise<WebResponse<CreateBookResponse>> {
    const response = await this.bookService.registerBook(request);
    return { data: response };
  }
}
