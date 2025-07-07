import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';
import { CommentService } from './Comment.service';
import { BugDetalsDto, BugsClient } from '../web-api-client';

@Injectable({
  providedIn: 'root'
})
export class BugService {
  constructor(public bugServer: HttpClient,public BugClient:BugsClient,public commentService:CommentService) { }
  


  basicUrl: string = "https://localhost:5001/api/Bugs/all";

  getAllBugs(): Observable<Array<Bug>> {
    return this.bugServer.get<Array<Bug>>(this.basicUrl);
  }
  getBugById(id: number): Observable<BugDetalsDto> {
    return this.BugClient.getBugDetialsByID(id);
}

  deleteComment(){}
  addComment(){}
  getCurrentUserPermissions(){}
  getCommentsByBugId(){}
}
