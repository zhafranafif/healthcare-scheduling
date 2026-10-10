import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class ScheduleNotificationProducer {
    constructor(@InjectQueue("notification-queue") private readonly notificationQueue: Queue) {}

    async enqueueEmail(email: string, subject: string, message: string, jobId: string): Promise<void> {
        await this.notificationQueue.add(
            "send-email",
            { email, subject, message },
            { jobId },
        );
    }
}