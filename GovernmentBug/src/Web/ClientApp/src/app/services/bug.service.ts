import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';

@Injectable({
  providedIn: 'root'
})
export class BugService {
  constructor(public bugServer: HttpClient) { }
  selectedBug :Bug = {
      bugId: 1,
      title: 'שגיאה בטעינת דף הבית',
      description: 'בעת כניסה לדף הבית מתקבלת שגיאת 500',
      priorityName: '1',
      statusName: '1',
      assignedToUserFullName: "---",
      createdByUserFullName: 'רונית כהן',
      createdDate: new Date('2025-06-25T09:15:00'),
      comments: [],
      categoryName: '----'
  }
  allBugs: Array<Bug> = new Array<Bug>();

  basicUrl: string = "https://localhost:5001/api/Bugs/all";

  getAllBugs(): Observable<Array<Bug>> {
    return this.bugServer.get<Array<Bug>>(this.basicUrl);
  }
}
