import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';

@Injectable({
  providedIn: 'root'
})
export class BugService {
  constructor(public bugServer: HttpClient) {}

  allBugs: Array<Bug> = new Array<Bug>();
selectedBug:Bug={
   bugID: 1,
  title: 'שגיאה בטעינת דף הבית',
  description: 'בעת כניסה לדף הבית מתקבלת שגיאת 500',
  priortyId: '1',
  statusId: '1',
  createdByUserId: 101,
  createdByUserFullName: 'רונית כהן',
  createdDate: new Date('2025-06-25T09:15:00'),
  comments: [
  ],
}
  basicUrl: string = "https://localhost:5001/api/Bugs/";

  getAllBugs(): Observable<Array<Bug>> {
    return this.bugServer.get<Array<Bug>>(this.basicUrl);
  }
}
