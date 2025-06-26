export class Comment {
  constructor(
    public commentID: number,
    public bugID: number,
    public commentText: string,
    public commentedBy: number,
    public commentDate: Date
  ) {}
}
