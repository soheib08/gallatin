import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { CreateTaskCommand } from '../domain/command/create-task.command';
import { DeleteTaskCommand } from '../domain/command/delete-task.command';
import { TaskListQuery } from '../domain/query/get-tasks';
import {
  CreateTaskRequest,
  DeleteTaskRequest,
  GrpcService,
  TaskListRequest,
} from '../domain/interface/task-grpc.interface';
import { TaskListDto } from './dto/task-list.dto';

@Controller()
export class TaskController implements GrpcService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('TasksService', 'CreateTask')
  async createTask(data: CreateTaskRequest) {
    try {
      return this.commandBus.execute(
        new CreateTaskCommand(data.title, data.description, data.parent),
      );
    } catch (err) {
      return new RpcException('parent not found');
    }
  }

  @GrpcMethod('TasksService', 'DeleteTask')
  async deleteTask(data: DeleteTaskRequest) {
    this.commandBus.execute(new DeleteTaskCommand(data.id));
    return { ok: true };
  }

  @GrpcMethod('TasksService', 'TaskList')
  async taskList(data: TaskListRequest): Promise<TaskListDto> {
    return this.queryBus.execute(new TaskListQuery(data.page, data.limit));
  }
}
