import { Task } from 'src/infrastructure/entity/task.entity';

export class TaskModel {
  readonly id: string;
  readonly parentId?: string;
  readonly title: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly parent?: Task;

  constructor(id: string, title: string, description: string, parentId?: Task) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.parent = parentId ? parentId : null;
  }
}

// export class CreateTaskDto {
//   readonly id: string;
//   readonly parent?: Task;
//   readonly title: string;
//   readonly description: string;
//   readonly createdAt: Date;
//   readonly updatedAt: Date;

//   constructor(id: string, title: string, description: string, parent?: Task) {
//     this.id = id;
//     this.title = title;
//     this.description = description;
//     this.parent = parent ? parent : null;
//   }
