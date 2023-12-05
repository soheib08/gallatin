import { NestFactory } from '@nestjs/core';
import {
  Transport,
  MicroserviceOptions,
  GrpcOptions,
  RmqOptions,
} from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rabbitOptions: RmqOptions = {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://127.0.0.1:5672'],
      queue: 'logs',
      queueOptions: { durable: false },
      prefetchCount: 1,
    },
  };
  const grpcOptions: GrpcOptions = {
    transport: Transport.GRPC,
    options: {
      url: 'localhost:50051',
      package: 'task',
      protoPath: join(__dirname, './', 'task.proto'),
    },
  };

  app.connectMicroservice<MicroserviceOptions>(grpcOptions);
  app.connectMicroservice<MicroserviceOptions>(rabbitOptions);

  await app.startAllMicroservices();
}
bootstrap();
