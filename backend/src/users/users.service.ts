import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserInfo } from "./interfaces/user.interface";

@Injectable()
export class UsersService {
    constructor(private readonly prismaService: PrismaService) {}

    async getUser(id: string): Promise<UserInfo> {
        const user = await this.prismaService.users.findUnique({
            where: { id },
            select: { email: true, firstname: true, lastname: true }
        });

        if (null === user) throw new NotFoundException();

        return user;
    }
}
