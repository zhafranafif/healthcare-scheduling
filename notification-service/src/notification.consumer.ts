import { MailerService } from "@nestjs-modules/mailer";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";


@Processor('notification-queue')
export class NotificationConsumer extends WorkerHost {

    constructor(
        private readonly mailerService: MailerService
    ) {
        super();
    }

    async process(job: Job<{ email: string; subject: string; message: string }>): Promise<void> {
        switch (job.name) {
            case 'send-email':
                await this.sendEmail(job.data.email, job.data.subject, job.data.message);
                break;
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    }

    private async sendEmail(email: string, subject: string, message: string): Promise<void> {
        await this.mailerService.sendMail({
            to: email,
            subject: subject,
            text: message,
        });
        console.log(`Sending email to ${email} with subject "${subject}" and message "${message}"`);
    }
}