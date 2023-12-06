import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TaskModel } from '../../domain/model/task.model';
import { Inject } from '@nestjs/common';
import { v4 } from 'uuid';
import { ITaskRepository } from 'src/domain/interface/task.repository.interface';
import { TaskCreatedEvent } from 'src/domain/event/task-created.event';
import { CreateTaskCommand } from '../../domain/command/create-task.command';
import { TaskDto } from '../dto/task.dto';
import { RpcException } from '@nestjs/microservices';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTaskCommand): Promise<TaskDto> {
    console.log('handler', command);

    if (command.parentId) {
      let foundParent = await this.taskRepository.findOne(command.parentId);
      if (!foundParent) throw new RpcException('parent task not found');

      const task = new TaskModel(
        v4(),
        command.title,
        command.description,
        foundParent,
      );
      let savedTask = await this.taskRepository.createOne(task);
      console.log('here1', savedTask);
      return savedTask;
    } else {
      const task = new TaskModel(v4(), command.title, command.description);
      let savedTask = await this.taskRepository.createOne(task);

      this.eventBus.publish(
        new TaskCreatedEvent(savedTask.id, savedTask.title),
      );
      console.log('here2', savedTask);
      return savedTask;
    }
  }
}
