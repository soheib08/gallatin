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
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'task',
      url: 'localhost:50051',
      protoPath: join(__dirname, './', 'task.proto'),
    },
  });

  await app.listen();
  // await app.connectMicroservice<MicroserviceOptions>(grpcOptions);
  // await app.startAllMicroservices();
}
bootstrap();
