import { Inject } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
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

  async execute(command: DeleteTaskCommand): Promise<boolean> {
    this.taskRepository.deleteOne(command.id);
    this.eventBus.publish(new TaskDeletedEvent());

    return true;
  }
}
