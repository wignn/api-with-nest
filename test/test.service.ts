import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';


@Injectable()
export class TestingService {
    constructor(private PrismaService: PrismaService) {
        console.log('TestingService instantiated');
    }
}