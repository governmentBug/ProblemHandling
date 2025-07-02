import { Injectable } from '@angular/core';
import { Bug } from '../models/bug.model';
import { Comment } from '../models/comment.model';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BugService {

  constructor() { }
  selectedBug: Bug = {
    bugID: 1234,
    title: 'שדה לא מוצג נכון',
    priortyId: '2',
    description: 'כאשר פותחים את המסך הראשי השדה לא מוצג',
    statusId: 'פתוח',
    createdByUserId: 1,
    createdByUserFullName: 'שירה כהן',
    createdDate: new Date(),
    comments:[]
  };

}
