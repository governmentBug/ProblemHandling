import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';

@Injectable({
  providedIn: 'root'
})
export class BugService {
  constructor(public bugServer: HttpClient) { }
  public selectedBug: Bug | null = null;

  basicUrl: string = "https://localhost:5001/api/Bugs/";

  getAllBugs(): Observable<Array<Bug>> {
    return this.bugServer.get<Array<Bug>>(`${this.basicUrl}all`);
  }
  getCategories(): Observable<string[]> {
    return this.bugServer.get<string[]>("https://localhost:5001/api/Category");
  }

  getStatuses(): Observable<string[]> {
    return this.bugServer.get<string[]>("https://localhost:5001/api/Status");
  }

  getPriorities(): Observable<string[]> {
    return this.bugServer.get<string[]>("https://localhost:5001/api/Priority");
  }

}
