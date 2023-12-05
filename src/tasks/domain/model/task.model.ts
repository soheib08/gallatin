export class TaskModel {
  readonly id: string;
  readonly parentId: string;
  readonly title: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(title: string, description: string, parentId?: string) {
    this.title = title;
    this.description = description;
    this.parentId = parentId ? parentId : null;
  }
}
