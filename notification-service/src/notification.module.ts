import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { NotificationConsumer } from './notification.consumer.js';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: Number(process.env.REDIS_PORT ?? 6379),
      }
    }),
    BullModule.registerQueue({
      name: 'notification-queue',
    }),
    MailerModule.forRoot({
      transport: {
        host: '://resend.com',
        port: 465,
        secure: true,
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY,
        },
      },
      defaults: {
        from: '"Acme" <onboarding@resend.dev>',
      },
    }),
  ],
  providers: [NotificationConsumer],
})
export class NotificationModule {}
