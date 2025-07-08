import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';
import { CommentService } from './Comment.service';
import { BugDetalsDto, BugsClient, UpdateBugAndClosedCommand, UpdateBugCommand } from '../web-api-client';


@Injectable({
  providedIn: 'root'
})
export class BugService {
  basicUrl: string = "https://localhost:5001/api/Bugs/all";
  constructor(public bugServer: HttpClient, public BugClient: BugsClient, public commentService: CommentService) { }

  getAllBugs(): Observable<Array<Bug>> {
    return this.bugServer.get<Array<Bug>>(this.basicUrl);
  }
  getBugById(id: number): Observable<BugDetalsDto> {
    return this.BugClient.getBugDetialsByID(id);
  }
  updateBug(id: number, update: any): Observable<void> {
    const command=new UpdateBugCommand() 
    command.bugId=id
    command.categoryId=update.categoryId
    command.description=update.description
    command.priorityId=update.priorityId
    command.title=update.title
    command.statusId=update.statusId
    //בהמשך נטפל במי שמטפל בבאג
    console.log(command);
    
    return this.BugClient.updateBug(id, command);
  }

  updateBugAndClosed(id: number, reasonForClosure: string): Observable<void> {
    const command = new UpdateBugAndClosedCommand();
    command.bugId = id;
    command.reasonForClosure = reasonForClosure;
    command.statusId=6
    return this.BugClient.updateBugAndClosed(id, command);
  }
  deleteBug(id: number): Observable<void> {
    return this.BugClient.deleteBug(id);
  }
}
