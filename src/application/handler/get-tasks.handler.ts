import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/infrastructure/entity/task.entity';
import { Repository } from 'typeorm';
import { TaskListDto } from 'src/application/dto/task-list.dto';
import { TaskListQuery } from 'src/domain/query/get-tasks';
import { TaskListEvent } from '../../domain/event/task-list.event';

@QueryHandler(TaskListQuery)
export class TaskListHandler implements IQueryHandler<TaskListQuery> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: TaskListQuery): Promise<TaskListDto> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      take: query.limit,
      skip: (query.page - 1) * query.limit,
    });

    this.eventBus.publish(new TaskListEvent());

    return {
      items: tasks,
      total: total,
    };
  }
}
