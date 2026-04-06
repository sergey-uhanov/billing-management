import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { SeedRunner } from './seed.runner';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const runner = app.get(SeedRunner);
  await runner.run();
  await app.close();
}

bootstrap();
