import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'task',
      url: process.env.GRPC_URL,
      protoPath: join(__dirname, './', 'task.proto'),
    },
  });

  await app.listen();
}
bootstrap();
