import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';
import { CommentService } from './Comment.service';
import { BugDetalsDto, BugsClient, CategoryClient, PriorityClient, StatusClient, UpdateBugAndClosedCommand, UpdateBugCommand } from '../web-api-client';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  basicUrl: string = "https://localhost:5001/api/Bugs/all";
  private priorities: any[] | null = null;
  private statuses: any[] | null = null;
  private categories: any[] | null = null;

  constructor(
    public PriorityClient: PriorityClient,
    public StatusClient: StatusClient,
    public CategoryClient: CategoryClient,
  ) {}

  // שליפת כל העדיפויות (עם קאש)
  getAllPriority() {
    if (this.priorities) {
      return new Observable<any[]>(observer => {
        observer.next(this.priorities!);
        observer.complete();
      });
    }
    return this.PriorityClient.getAllPriorities().pipe(
      tap(data => this.priorities = data)
    );
  }

  // שליפת כל הסטטוסים (עם קאש)
  getAllStatuses() {
    if (this.statuses) {
      return new Observable<any[]>(observer => {
        observer.next(this.statuses!);
        observer.complete();
      });
    }
    return this.StatusClient.getAllStatuses().pipe(
      tap(data => this.statuses = data)
    );
  }

  // שליפת כל הקטגוריות (עם קאש)
  getAllCategories() {
    if (this.categories) {
      return new Observable<any[]>(observer => {
        observer.next(this.categories!);
        observer.complete();
      });
    }
    return this.CategoryClient.getAllCategories().pipe(
      tap(data => this.categories = data)
    );
  }
}