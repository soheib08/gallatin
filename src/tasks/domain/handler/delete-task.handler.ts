import { NotFoundException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteTaskCommand } from 'src/tasks/application/command/delete-task.command';
import { Task } from 'src/tasks/infrastructure/entity/task.entity';
import { Repository } from 'typeorm';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    let foundTask = this.taskRepository.exist({
      where: { parentId: command.id },
    });
    if (!foundTask) throw new NotFoundException('task not found');

    this.taskRepository.delete(command.id);
  }
}
