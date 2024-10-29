import { Http } from 'winston/lib/winston/transports';
import {
  ConnectGenreRequest,
  CreateGenreRequest,
  DisconnectGenreRequest,
  GetGenreResponse,
  UpdateGenreRequest,
  UpdateGenreResponse,
} from '../model/genre.model';
import { GenreService } from './genre.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';

@Controller('/api/genre')
export class GenreController {
  constructor(private GenreService: GenreService) {}

  @Post()
  @HttpCode(200)
  async createGenre(
    @Body() request: CreateGenreRequest,
  ): Promise<CreateGenreRequest> {
    const response = await this.GenreService.CreateGenre(request);
    return response;
  }

  @Get()
  @HttpCode(200)
  async getAll(request): Promise<any> {
    const response = await this.GenreService.getAll();
    return response;
  }

  @Get(':query')
  @HttpCode(200)
  async GetGenrByQuery(
    @Param('query') request: string,
  ): Promise<GetGenreResponse> {
    const response = await this.GenreService.GetGenreByQuery(request);
    return response;
  }

  @Put(':id')
  @HttpCode(200)
  async UpdateGenre(
    @Param('id') id: string,
    @Body() request: UpdateGenreRequest,
  ): Promise<UpdateGenreResponse> {
    const response = await this.GenreService.UpdateGenre(id, request);
    return response;
  }

  @Patch()
  @HttpCode(200)
  async ConenctGenre(@Body() request: ConnectGenreRequest): Promise<any> {
    const response = await this.GenreService.ConnectGenre(request);
    return response;
  }

  @Put()
  @HttpCode(200)
  async DisconnectGenre(
    @Body() request:DisconnectGenreRequest ): Promise<any> {
    const response = await this.GenreService.DisconnectGenre(request);
    return response
  }

  @Delete(':id')
  @HttpCode(200)
  async DeleteGenre(@Param('id') request: string): Promise<string> {
    const response = await this.GenreService.DeleteGenre(request);
    return response;
  }
}
