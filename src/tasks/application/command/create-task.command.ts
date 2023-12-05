export class CreateTaskCommand {
  constructor(
    public readonly parentId: string,
    public readonly title: string,
    public readonly description: string,
  ) {}
}
