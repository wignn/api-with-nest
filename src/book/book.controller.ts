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
  async Create(
    @Body() request: CreateBookRequest,
  ): Promise<WebResponse<CreateBookResponse>> {
    const response = await this.bookService.registerBook(request);
    return { data: response };
  }

  @Get(':id')
  async GetByQuery(
    @Param('id') request: string,
  ): Promise<WebResponse<any>> {
    const response = await this.bookService.findByQuery(request);
    return { data: response };
  }

  @Get()
  async GetAll(
    @Body() request: any
  ):Promise<WebResponse<any>> {
    const response = await this.bookService.getAll();
    return { data: response };
  }

  @Put(':id')
  async Update(
    @Param('id') id: string,
    @Body() body: CreateBookRequest,
  ):Promise<WebResponse<any>> {
    const response = await this.bookService.updateBook(id, body);
    return { data: response }
  }


  @Delete(':id')
  async DeleteBook(
    @Param('id') request: string,
  ):Promise<WebResponse<any>> {
    const response = await this.bookService.deleteBook(request);
    return { data: response };
  }
  
}
