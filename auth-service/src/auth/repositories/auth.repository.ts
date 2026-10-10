import { PrismaService } from "@healthcare-scheduling/database";
import { Injectable } from "@nestjs/common";
import { CreateUserData, UserRecord } from "../types/auth.types.js";
import { convertDate } from "../../util/convert-date.js";

@Injectable()
export class AuthRepository {
    constructor(
        private readonly prismaService: PrismaService
    ) {}

    async createUser(data: CreateUserData): Promise<UserRecord> {
        const user = await this.prismaService.orm.User.create(data);

        return {
            id: user.id,
            email: user.email,
            password: user.password,
            createdAt: convertDate(user.createdAt),
            updatedAt: convertDate(user.updatedAt),
        };
    }

    async findByEmail(email: string): Promise<UserRecord | null> {
        const user = await this.prismaService.orm.User.where({ email }).first();

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            password: user.password,
            createdAt: convertDate(user.createdAt),
            updatedAt: convertDate(user.updatedAt),
        };
    }
}