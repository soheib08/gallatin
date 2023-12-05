import { TaskDto } from './task.dto';

export class TaskListDto {
  items: Array<TaskDto>;
  totalItems: number;
}
