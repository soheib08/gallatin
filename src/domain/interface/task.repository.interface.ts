import { TaskModel } from '../model/task.model';

export interface ITaskRepository {
  createOne(task: TaskModel): Promise<TaskModel>;
  deleteOne(id: string): Promise<void>;
  exist(query): Promise<boolean>;
  findAndCount(
    page: number,
    limit: number,
  ): Promise<{ items: Array<TaskModel>; total: number }>;
}

export const ITaskRepository = Symbol('ITaskRepository');
