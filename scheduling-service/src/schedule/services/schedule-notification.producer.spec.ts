import { Queue } from "bullmq";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScheduleNotificationProducer } from "./schedule-notification.producer.js";

describe("ScheduleNotificationProducer", () => {
    let producer: ScheduleNotificationProducer;
    let queue: Pick<Queue, "add">;

    beforeEach(() => {
        queue = { add: vi.fn().mockResolvedValue(undefined) };
        producer = new ScheduleNotificationProducer(queue as Queue);
    });

    it("adds an email job with its stable id", async () => {
        await producer.enqueueEmail(
            "person@example.com",
            "Schedule created",
            "Your schedule was created.",
            "schedule-created-schedule-1",
        );

        expect(queue.add).toHaveBeenCalledWith(
            "send-email",
            {
                email: "person@example.com",
                subject: "Schedule created",
                message: "Your schedule was created.",
            },
            { jobId: "schedule-created-schedule-1" },
        );
    });

    it("propagates queue errors to the caller", async () => {
        vi.mocked(queue.add).mockRejectedValue(new Error("Redis unavailable"));

        await expect(producer.enqueueEmail("person@example.com", "Subject", "Body", "job-1"))
            .rejects.toThrow("Redis unavailable");
    });
});