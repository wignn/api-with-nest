import { PrismaService } from '../../common/prisma.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class BookGuard implements CanActivate {
    constructor(private readonly prismaService: PrismaService) {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization;

        if (!token) {
            throw new UnauthorizedException();
        }
        const user = await this.prismaService.user.findFirst({
            where: {
                token: token
            }
        })
        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }

}