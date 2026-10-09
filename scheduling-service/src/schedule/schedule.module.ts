import { Module } from "@nestjs/common";
import { ScheduleService } from "./services/schedule.service.js";
import { ScheduleRepository } from "./repositories/schedule.repositoy.js";
import { ScheduleResolver } from "./resolvers/schedule.resolver.js";
import { PrismaModule } from "@healthcare-scheduling/database";
import { AuthModule } from "../guard/auth.module.js";
import { DoctorModule } from "../doctor/doctor.module.js";
import { CustomerModule } from "../customer/customer.module.js";
import { BullModule } from "@nestjs/bullmq";
import { ScheduleNotificationProducer } from "./services/schedule-notification.producer.js";


@Module({
    imports: [
        PrismaModule,
        AuthModule,
        DoctorModule,
        CustomerModule,
        BullModule.forRoot({
            connection: {
                host: process.env.REDIS_HOST ?? "localhost",
                port: Number(process.env.REDIS_PORT ?? 6379),
            },
            defaultJobOptions: {
                attempts: 5,
                backoff: { type: "exponential", delay: 1000 },
                removeOnComplete: true,
            },
        }),
        BullModule.registerQueue({ name: "notification-queue" }),
    ],
    providers: [ScheduleService, ScheduleRepository, ScheduleResolver, ScheduleNotificationProducer],
})
export class ScheduleModule {}