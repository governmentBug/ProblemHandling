
export class AbbBug {
  constructor(
    public title?: string,
    public description?: string,
    public priorityId?: number,
    public categoryId?: number,
    public createdByUserId?: number,
    public created?: string,
    public statusId?: number,
  ) {}
}