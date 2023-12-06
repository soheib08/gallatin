import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

export class TaskCreatedEvent {
  constructor() {}
}

@EventsHandler(TaskCreatedEvent)
export class TaskCreatedEventHandler
  implements IEventHandler<TaskCreatedEvent>
{
  constructor(@Inject('TASK_SERVICE') private client: ClientProxy) {}

  handle(event: TaskCreatedEvent) {
    this.client.emit<number>('task_created', new TaskCreatedEvent());
  }
}
