import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientProxy } from '@nestjs/microservices';

export class TaskListEvent {
  constructor() {}
}

@EventsHandler(TaskListEvent)
export class TaskListEventHandler implements IEventHandler<TaskListEvent> {
  constructor(@Inject('TASK_SERVICE') private client: ClientProxy) {}

  handle(event: TaskListEvent) {
    this.client.emit<number>('task_list', new TaskListEvent());
  }
}
