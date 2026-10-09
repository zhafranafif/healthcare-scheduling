import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module.js';

async function bootstrap() {
  await NestFactory.createApplicationContext(NotificationModule);
}
await bootstrap();
