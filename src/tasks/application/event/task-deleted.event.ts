import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

export class TaskDeletedEvent {
  constructor(
    public readonly taskId: string,
    public readonly taskName: string,
  ) {}
}

@EventsHandler(TaskDeletedEvent)
export class TaskDeletedEventHandler
  implements IEventHandler<TaskDeletedEvent>
{
  constructor(@Inject('TASK_SERVICE') private client: ClientProxy) {}

  handle(event: TaskDeletedEvent) {
    this.client.emit<number>(
      'task_deleted',
      new TaskDeletedEvent(event.taskId, event.taskName),
    );
  }
}
