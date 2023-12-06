export class TaskDto {
  readonly id: string;
  readonly parentId?: string;
  readonly title: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
