import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './infrastructure/entity/task.entity';
import { CreateTaskHandler } from './domain/handler/create-task.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { DeleteTaskHandler } from './domain/handler/delete-task.handler';
import { TaskCreatedEventHandler } from './application/event/task-created.event';
import { TaskDeletedEventHandler } from './application/event/task-deleted.event';
import { TaskListEventHandler } from './application/event/task-list.event';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskController } from './application/task.controller';

export const QueryHandlers = [];
export const CommandHandlers = [CreateTaskHandler, DeleteTaskHandler];
export const EventHandlers = [
  TaskCreatedEventHandler,
  TaskDeletedEventHandler,
  TaskListEventHandler,
];
@Module({
  imports: [
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
  providers: [...CommandHandlers, ...QueryHandlers, ...EventHandlers],
  exports: [TypeOrmModule],
})
export class TaskModule {}
