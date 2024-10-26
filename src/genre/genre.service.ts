import {
  ConnectGenreRequest,
  CreateGenreResponse,
  DeleteGenreRequest,
  GetGenreRequest,
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

  async UpdateGenre(request: UpdateGenreRequest): Promise<CreateGenreResponse> {
    this.logger.info(`Updating Genre ${JSON.stringify(request)}`);
    const CreateGenreRequest: CreateGenreRequest =
      this.validationService.validate(GenreValidation.CREATE, request);

    const genre = await this.prismaService.genre.update({
      where: { id: CreateGenreRequest.title },
      data: CreateGenreRequest,
    });

    return {
      id: genre.id,
      title: genre.title,
      description: genre.description,
    };
  }

  async GetGenreById(request: GetGenreRequest): Promise<GetGenreResponse> {
    const GetGenreRequest: GetGenreRequest = this.validationService.validate(
      GenreValidation.GET,
      request,
    );

    const genre = await this.prismaService.genre.findFirst({
      where: {
        OR: [
          { id: GetGenreRequest.id },
          { title: { contains: GetGenreRequest.id } },
        ]
      }
    });
    return {
      id: genre.id,
      title: genre.title,
      description: genre.description,
    };
  }

  async DeleteGenre(request: DeleteGenreRequest): Promise<string> {
    this.logger.info(`Deleting Genre ${request.id}`);
    const DeleteGenreRequest: DeleteGenreRequest =
      this.validationService.validate(GenreValidation.DELETE, request);

    await this.prismaService.genre.delete({
      where: { id: DeleteGenreRequest.id },
    });

    return 'Genre deleted';
  }

  async ConnectGenre (request: ConnectGenreRequest):Promise<String>{
    this.logger.info(`Connecting Genre ${JSON.stringify(request)}`);
    const ConnectGenreRequest: ConnectGenreRequest = this.validationService.validate(GenreValidation.CONECTED, request);
    const genre = await this.prismaService.genre.update({
      where: { id: ConnectGenreRequest.genreId },
        data:{
          bookId: ConnectGenreRequest.bookId
        }
    })

    return 'Genre connected';
  }
}
