import {
  ConnectGenreRequest,
  CreateGenreResponse,
  DeleteGenreRequest,
  DisconnectGenreRequest,
  GetGenreResponse,
  UpdateGenreRequest,
} from './../model/genre.model';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validate.service';
import { CreateGenreRequest } from '../model/genre.model';
import { Logger } from 'winston';
import { GenreValidation } from './genre.validation';

@Injectable()
export class GenreService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async CreateGenre(request: CreateGenreRequest): Promise<CreateGenreResponse> {
    this.logger.info(`Creating Genre ${JSON.stringify(request)}`);
    const CreateGenreRequest: CreateGenreRequest =
      this.validationService.validate(GenreValidation.CREATE, request);

    const totalGenreWithSameName = await this.prismaService.genre.count({
      where: {
        title: CreateGenreRequest.title,
      },
    });

    if (totalGenreWithSameName != 0) {
      throw new HttpException('Genre already exists', 400);
    }

    const genre = await this.prismaService.genre.create({
      data: CreateGenreRequest,
    });

    return {
      id: genre.id,
      title: genre.title,
      description: genre.description,
    };
  }

  async getAll(): Promise<any> {
    this.logger.info('Getting all genres');
    const genres = await this.prismaService.genre.findMany();
    return genres;
  }

  async UpdateGenre(
    id: string,
    request: UpdateGenreRequest,
  ): Promise<CreateGenreResponse> {
    this.logger.info(`Updating Genre ${JSON.stringify(request)}`);
    const CreateGenreRequest: CreateGenreRequest =
      this.validationService.validate(GenreValidation.UPDATE, request);

    const genre = await this.prismaService.genre.update({
      where: { id },
      data: CreateGenreRequest,
    });

    return {
      id: genre.id,
      title: genre.title,
      description: genre.description,
    };
  }

  async GetGenreByQuery(request: string): Promise<GetGenreResponse> {
    const genre = await this.prismaService.genre.findFirst({
      where: {
        OR: [{ id: request }, { title: { contains: request } }],
      },
    });
    return {
      id: genre.id,
      title: genre.title,
      description: genre.description,
    };
  }

  async DeleteGenre(request: string): Promise<string> {
    this.logger.info(`Deleting Genre ${request}`);
    const DeleteGenreRequest: DeleteGenreRequest = this.validationService.validate(
      GenreValidation.DELETE, 
      { id: request }
    );
    await this.prismaService.bookGenre.deleteMany({
      where: { genreId: DeleteGenreRequest.id },
    });
    await this.prismaService.genre.delete({
      where: { id: DeleteGenreRequest.id },
    });
  
    return 'Genre deleted';
  }
  
  async ConnectGenre(request: ConnectGenreRequest): Promise<String> {
    console.log(request);
    this.logger.info(`Connecting Genre ${JSON.stringify(request)}`);
    const ConnectGenreRequest: ConnectGenreRequest =
      this.validationService.validate(GenreValidation.CONECTED, request);

    await this.prismaService.bookGenre.create({
      data: {
        genreId: ConnectGenreRequest.genreId,
        bookId: ConnectGenreRequest.bookId,
      },
    });

    return 'Genre connected';
  }


  async DisconnectGenre(request: DisconnectGenreRequest): Promise<String> {
    this.logger.info(`Disconnecting Genre ${JSON.stringify(request)}`);

    const existingRelation = await this.prismaService.bookGenre.findFirst({
      where: {
        bookId: request.bookId,
        genreId: request.genreId,
      },
    });

    if (!existingRelation) {
      this.logger.warn(`Relation not found for bookId: ${request.bookId} and genreId: ${request.genreId}`);
      return `No relation found for bookId: ${request.bookId} and genreId: ${request.genreId}`;
    }

    await this.prismaService.bookGenre.delete({
      where: {
        bookId_genreId: {
          bookId: request.bookId,
          genreId: request.genreId,
        },
      },
    });
  
    return 'Genre disconnected';
  }
  
}
