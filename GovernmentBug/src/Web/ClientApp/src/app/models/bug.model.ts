
export class Bug {
  constructor(
    public bugId: number,
    public title: string,
    public description: string,
    public priorityName: string,
    public statusName: string,
    public categoryName: string,
    public assignedToUserFullName: string,
    public createdByUserFullName: string,
    public createdDate: Date
  ) {}
}
