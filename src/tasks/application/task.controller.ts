import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateTaskCommand } from './command/create-task.command';
import { DeleteTaskCommand } from './command/delete-task.command';
import { TaskListQuery } from './query/get-tasks';

export interface CreateTaskRequest {
  title: string;
  description: string;
  parent: string;
}
export interface DeleteTaskRequest {
  id: string;
}
export interface TaskListRequest {
  page: number;
  limit: number;
}
export interface Task {
  id: string;
  title: string;
  description: string;
  parent: string;
  createdAt: Date;
  updatedAt: Date;
}

@Controller()
export class TaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('TasksService', 'CreateTask')
  createTask(data: CreateTaskRequest) {
    this.commandBus.execute(
      new CreateTaskCommand(data.parent, data.title, data.description),
    );
  }

  @GrpcMethod('TasksService', 'DeleteTask')
  deleteTask(data: DeleteTaskRequest) {
    this.commandBus.execute(new DeleteTaskCommand(data.id));
  }

  @GrpcMethod('TasksService', 'TaskList')
  taskList(data: TaskListRequest) {
    this.queryBus.execute(new TaskListQuery(data.page, data.limit));
  }
}
