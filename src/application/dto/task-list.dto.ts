import { TaskDto } from './task.dto';

export class TaskListDto {
  items: Array<TaskDto>;
  total: number;
}
