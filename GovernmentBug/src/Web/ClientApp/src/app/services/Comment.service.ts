import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentsClient, CreateCommentCommand, CommentsBugDto } from '../web-api-client';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

constructor(private commentServer: CommentsClient) { }

  // שליפת הערות לפי באג
  getCommentsByBugId(bugId: number): Observable<CommentsBugDto[]> {
    return this.commentServer.getCommentsByBugID(bugId);
  }

  // הוספת הערה חדשה
  addComment(bugId: number, text: string): Observable<number> {
    const command = new CreateCommentCommand();
    command.bugID = bugId;
    command.commentText = text;
    return this.commentServer.createComment(command);
  }

  // (כאן תוכלי בעתיד להוסיף בדיקת הרשאות מול שרת או טוקן)
  getCurrentUserPermissions(): boolean {
    // בינתיים סתם מוחזר true
    return true;
  }

  // מחיקת תגובה – אם יש לך מתודה לכך מהשרת, תכתבי אותה כאן:
  deleteComment(commentId: number): Observable<any> {
    throw new Error("לא ממומש עדיין – יש לך endpoint למחיקה?");
  }

}
