import { InjectRepository } from '@nestjs/typeorm';
import { ITaskRepository } from '../../domain/interface/task.repository.interface';
import { Task } from 'src/infrastructure/entity/task.entity';
import { Repository } from 'typeorm';
import { TaskModel } from '../../domain/model/task.model';

export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createOne(task: TaskModel): Promise<TaskModel> {
    let taskModel = this.taskRepository.create(task);
    return await this.taskRepository.save(taskModel);
  }

  async deleteOne(id: string) {
    await this.taskRepository.delete(id);
  }

  async findOne(id: string) {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async findAndCount(
    page: number,
    limit: number,
  ): Promise<{ items: Array<TaskModel>; total: number }> {
    const [tasks, total] = await this.taskRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      relations: ['parent'],
    });
    return {
      items: tasks,
      total: total,
    };
  }
}
