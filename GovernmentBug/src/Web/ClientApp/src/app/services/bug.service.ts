import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';
import { AbbBug } from '../models/addBug.model';


@Injectable({
  providedIn: 'root'
})
export class BugService {
  constructor(public bugServer: HttpClient) { }

  allBugs: Array<Bug> = new Array<Bug>();

  basicUrl: string = "https://localhost:5001/api/Bugs/all";

  getAllBugs(): Observable<Array<Bug>> {
    return this.bugServer.get<Array<Bug>>(this.basicUrl);
  }
  createBug(bug: AbbBug): Observable<Bug> {
    const createUrl: string = "https://localhost:5001/api/Bugs";
    return this.bugServer.post<Bug>(createUrl, bug);
  }
}
