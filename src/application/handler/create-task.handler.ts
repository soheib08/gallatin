import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TaskModel } from '../../domain/model/task.model';
import { Inject, NotFoundException } from '@nestjs/common';
import { v4 } from 'uuid';
import { ITaskRepository } from 'src/domain/interface/task.repository.interface';
import { TaskCreatedEvent } from 'src/domain/event/task-created.event';
import { CreateTaskCommand } from '../../domain/command/create-task.command';
import { TaskDto } from '../dto/task.dto';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTaskCommand): Promise<TaskDto> {
    if (command.parentId) {
      let foundParent = this.taskRepository.exist({
        where: { parentId: command.parentId },
      });
      if (!foundParent) throw new NotFoundException('parent task not found');
    }
    const task = new TaskModel(
      v4(),
      command.title,
      command.description,
      command.parentId,
    );
    let savedTask = await this.taskRepository.createOne(task);

    this.eventBus.publish(new TaskCreatedEvent(savedTask.id, savedTask.title));

    return savedTask;
  }
}
