import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './infrastructure/entity/task.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskController } from './application/task.controller';
import { CreateTaskHandler } from './application/handler/create-task.handler';
import { DeleteTaskHandler } from './application/handler/delete-task.handler';
import { TaskCreatedEventHandler } from './domain/event/task-created.event';
import { TaskDeletedEventHandler } from './domain/event/task-deleted.event';
import { TaskListEventHandler } from './domain/event/task-list.event';
import { TaskListHandler } from './application/handler/get-tasks.handler';
import { ITaskRepository } from './domain/interface/task.repository.interface';
import { TaskRepository } from './infrastructure/repository/task-repository';
import { validate } from './infrastructure/config/app.configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const QueryHandlers = [TaskListHandler];
export const CommandHandlers = [CreateTaskHandler, DeleteTaskHandler];
export const EventHandlers = [
  TaskCreatedEventHandler,
  TaskDeletedEventHandler,
  TaskListEventHandler,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        password: configService.get('DATABASE_PASSWORD'),
        username: configService.get('DATABASE_USERNAME'),
        database: configService.get('DATABASE_NAME'),
        entities: [Task],
        synchronize: true,
        logging: true,
        ssl: false,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Task]),
    CqrsModule,
    ClientsModule.register([
      {
        name: 'TASK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBIT_URL],
          queue: 'logs',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    { provide: ITaskRepository, useClass: TaskRepository },
  ],
})
export class AppModule {}
