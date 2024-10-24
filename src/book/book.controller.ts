import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
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

  @Get(':id')
  async getBooks(
    @Param('id') request: string,
  ):Promise<WebResponse<any>> {
    const response = await this.bookService.findByQuery(request);
    return { data: response };
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() body: CreateBookRequest,
  ):Promise<WebResponse<any>> {
    const response = await this.bookService.updateBook(id, body);
    return { data: response }
  }


  @Delete(':id')
  async deleteBook(
    @Param('id') request: string,
  ):Promise<WebResponse<any>> {
    const response = await this.bookService.deleteBook(request);
    return { data: response };
  }
  
}
