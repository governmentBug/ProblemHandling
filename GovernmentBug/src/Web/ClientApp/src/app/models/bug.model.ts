import { Comment } from './comment.model';

export class Bug {
  constructor(
    public bugID: number,
    public title: string,
    public description: string,
    public priortyId: string,
    public statusId: string,
    public createdByUserId: number,
    public createdByUserFullName: string,
    public createdDate: Date,
    public comments: Comment[] = []
  ) {}
}
