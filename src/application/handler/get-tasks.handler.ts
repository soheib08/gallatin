import { EventBus, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/infrastructure/entity/task.entity';
import { Repository } from 'typeorm';
import { TaskListDto } from 'src/application/dto/task-list.dto';
import { TaskListQuery } from 'src/domain/query/get-tasks';
import { TaskListEvent } from '../../domain/event/task-list.event';
import { Inject } from '@nestjs/common';
import { TaskRepository } from 'src/infrastructure/repository/task-repository';
import { ITaskRepository } from 'src/domain/interface/task.repository.interface';

@QueryHandler(TaskListQuery)
export class TaskListHandler implements IQueryHandler<TaskListQuery> {
  constructor(
    @Inject(ITaskRepository)
    private readonly taskRepository: ITaskRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(query: TaskListQuery): Promise<TaskListDto> {
    let res = await this.taskRepository.findAndCount(query.page, query.limit);
    let items = res.items.map((task) => {
      return { ...task, parent: task.parent ? task.parent.id : null };
    });
    this.eventBus.publish(new TaskListEvent());
    return {
      items: items,
      total: res.total,
    };
  }
}
