import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/tasks/infrastructure/entity/task.entity';
import { Repository } from 'typeorm';
import { TaskListDto } from 'src/tasks/application/dto/task-list.dto';
import { TaskListQuery } from 'src/tasks/application/query/get-tasks';

@QueryHandler(TaskListQuery)
export class TaskListHandler implements IQueryHandler<TaskListQuery> {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async execute(query: TaskListQuery): Promise<TaskListDto> {
    //add pagination
    const [tasks, total] = await this.taskRepository.findAndCount({
      take: query.limit,
      skip: (query.page - 1) * query.limit,
    });

    return {
      items: tasks,
      totalItems: total,
    };
  }
}
