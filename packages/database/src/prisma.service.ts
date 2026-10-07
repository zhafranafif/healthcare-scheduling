import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { db } from '../prisma/db.js';
@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
    readonly orm = db.orm.public;

    async onModuleInit() {
        await db.connect();
    }

    async onModuleDestroy() {
        await db.close();
    }
}