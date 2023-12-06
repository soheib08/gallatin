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
import { TaskRepository } from './infrastructure/task-repository';

export const QueryHandlers = [TaskListHandler];
export const CommandHandlers = [CreateTaskHandler, DeleteTaskHandler];
export const EventHandlers = [
  TaskCreatedEventHandler,
  TaskDeletedEventHandler,
  TaskListEventHandler,
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '54.37.137.106',
      port: 5432,
      password: 'changeme',
      username: 'postgres',
      entities: [Task],
      database: 'sternx',
      synchronize: true,
      logging: true,
      ssl: false,
    }),
    TypeOrmModule.forFeature([Task]),
    CqrsModule,
    ClientsModule.register([
      {
        name: 'TASK_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://127.0.0.1:5672'],
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
