import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';
import { AbbBug } from '../models/addBug.model';
import { Category } from '../models/category.module';


@Injectable({
  providedIn: 'root'
})
export class BugService {
  constructor(public bugServer: HttpClient) { }
  public selectedBug: Bug | null = null;

  basicUrl: string = "https://localhost:5001/api/Bugs/all";

  getAllBugs(): Observable<Array<Bug>> {
    return this.bugServer.get<Array<Bug>>(this.basicUrl);
  }

  createBug(bug: AbbBug): Observable<AbbBug> {
    const createUrl: string = "https://localhost:5001/api/Bugs";
    return this.bugServer.post<AbbBug>(createUrl, bug);
  }
}
