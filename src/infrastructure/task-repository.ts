import { InjectRepository } from '@nestjs/typeorm';
import { ITaskRepository } from '../domain/interface/task.repository.interface';
import { Task } from 'src/infrastructure/entity/task.entity';
import { Repository } from 'typeorm';
import { TaskModel } from '../domain/model/task.model';

export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createOne(task: TaskModel): Promise<TaskModel> {
    return await this.taskRepository.save(task);
  }

  async deleteOne(id: string) {
    await this.taskRepository.delete(id);
  }

  async exist(query) {
    return await this.taskRepository.exist(query);
  }

  async findAndCount(
    page: number,
    limit: number,
  ): Promise<{ items: Array<TaskModel>; total: number }> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      items: tasks,
      total: total,
    };
  }
}
