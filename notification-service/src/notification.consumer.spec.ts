import { MailerService } from "@nestjs-modules/mailer";
import { Job } from "bullmq";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificationConsumer } from "./notification.consumer.js";

describe("NotificationConsumer", () => {
    let consumer: NotificationConsumer;
    let mailerService: Pick<MailerService, "sendMail">;

    beforeEach(() => {
        mailerService = { sendMail: vi.fn().mockResolvedValue(undefined) };
        consumer = new NotificationConsumer(mailerService as MailerService);
    });

    it("sends the email from a send-email job", async () => {
        const job = {
            name: "send-email",
            data: {
                email: "person@example.com",
                subject: "Schedule created",
                message: "Your schedule was created.",
            },
        } as Job<{ email: string; subject: string; message: string }>;

        await consumer.process(job);

        expect(mailerService.sendMail).toHaveBeenCalledWith({
            to: "person@example.com",
            subject: "Schedule created",
            text: "Your schedule was created.",
        });
    });

    it("rejects an unknown job name", async () => {
        const job = {
            name: "unknown-job",
            data: {},
        } as Job<{ email: string; subject: string; message: string }>;

        await expect(consumer.process(job)).rejects.toThrow("Unknown job name: unknown-job");
        expect(mailerService.sendMail).not.toHaveBeenCalled();
    });

    it("propagates mail delivery failures so BullMQ can retry", async () => {
        vi.mocked(mailerService.sendMail).mockRejectedValue(new Error("SMTP unavailable"));
        const job = {
            name: "send-email",
            data: { email: "person@example.com", subject: "Subject", message: "Body" },
        } as Job<{ email: string; subject: string; message: string }>;

        await expect(consumer.process(job)).rejects.toThrow("SMTP unavailable");
    });
});