import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskCommand } from 'src/domain/command/delete-task.command';
import { TaskDeletedEvent } from 'src/domain/event/task-deleted.event';
import { ITaskRepository } from 'src/domain/interface/task.repository.interface';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    let foundTask = await this.taskRepository.exist({
      where: { parentId: command.id },
    });
    if (!foundTask) throw new Error('task not found');

    this.taskRepository.deleteOne(command.id);
    this.eventBus.publish(new TaskDeletedEvent());
  }
}
