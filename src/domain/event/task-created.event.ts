import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

export class TaskCreatedEvent {
  constructor(
    public readonly taskId: string,
    public readonly taskName: string,
  ) {}
}

@EventsHandler(TaskCreatedEvent)
export class TaskCreatedEventHandler
  implements IEventHandler<TaskCreatedEvent>
{
  constructor(@Inject('TASK_SERVICE') private client: ClientProxy) {}

  handle(event: TaskCreatedEvent) {
    console.log(event);

    this.client.emit<number>(
      'task_created',
      new TaskCreatedEvent(event.taskId, event.taskName),
    );
  }
}
