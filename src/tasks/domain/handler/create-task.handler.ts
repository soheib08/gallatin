import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskCommand } from 'src/tasks/application/command/create-task.command';
import { Repository } from 'typeorm';
import { Task } from '../../infrastructure/entity/task.entity';
import { TaskModel } from '../model/task.model';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateTaskCommand): Promise<void> {
    if (command.parentId) {
      let foundParent = this.taskRepository.exist({
        where: { parentId: command.parentId },
      });
      if (!foundParent) throw new NotFoundException('parent task not found');
    }
    const task = new TaskModel(
      command.title,
      command.description,
      command.parentId,
    );

    let createdTask = await this.taskRepository.create(task);
  }
}
