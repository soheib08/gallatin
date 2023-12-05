export class UpdateTaskCommand {
  constructor(
    public readonly id: string,
    public readonly parentId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}
