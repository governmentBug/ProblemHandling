import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentsClient, CreateCommentCommand, CommentsBugDto } from '../web-api-client';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

constructor(private commentServer: CommentsClient) { }


  getCommentsByBugId(bugId: number): Observable<CommentsBugDto[]> {
    return this.commentServer.getCommentsByBugID(bugId);
  }

  addComment(bugId: number, text: string,usersMentions:Array<number>): Observable<number> {
    const command = new CreateCommentCommand();
    command.bugID = bugId;
    command.commentText = text;
    command.usersMentions=usersMentions;
    return this.commentServer.createComment(command);
  }

  getCurrentUserPermissions(): boolean {
    // בינתיים סתם מוחזר true
    return true;
  }
  deleteComment(commentId: number): Observable<any> {
     return this.commentServer.deleteComment(commentId);
  }
}
