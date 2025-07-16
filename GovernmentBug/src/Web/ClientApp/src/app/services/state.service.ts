import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';
import { CommentService } from './Comment.service';
import { BugDetalsDto, BugsClient, CategoryClient, CategoryDto, PriorityClient, PriorityDto, StatusClient, StatusDto, UpdateBugAndClosedCommand, UpdateBugCommand, UserDto, UsersClient } from '../web-api-client';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private priorities: PriorityDto[] | null = null;
  private statuses: StatusDto[] | null = null;
  private categories: CategoryDto[] | null = null;
  private users: UserDto[] | null = null;
  private prioritiesMap: { [id: number]: string } = {};
  private statusesMap: { [id: number]: string } = {};
  private categoriesMap: { [id: number]: string } = {};
  private usersMap: { [id: number]: string } = {};

  constructor(
    private PriorityClient: PriorityClient,
    private StatusClient: StatusClient,
    private CategoryClient: CategoryClient,
    private UsersClient: UsersClient
  ) {}
  // שליפת כל המשתמשים (עם קאש)
  getAllUsers() {
    if (this.users) {
      return new Observable<any[]>(observer => {
        observer.next(this.users!);
        observer.complete();
      });
    }
    return this.UsersClient.getAllUsers().pipe(
      tap((data: any[]) => {
        this.users = data;
        this.usersMap = {};
        (data || []).forEach(item => this.usersMap[item.userId] = item.userName);
      })
    );
  }

  getUserById(id: number): string | undefined {
    if (!this.users) {
      this.getAllUsers().subscribe(); // שליפה ראשונית
      return undefined;
    }
    return this.usersMap[id];
  }

  getAllPriority() {
    if (this.priorities) {
      return new Observable<any[]>(observer => {
        observer.next(this.priorities!);
        observer.complete();
      });
    }
    return this.PriorityClient.getAllPriorities().pipe(
      tap(data => {
        this.priorities = data;
        this.prioritiesMap = {};
        data.forEach(item => this.prioritiesMap[item.priorityId] = item.priorityName);
      })
    );
  }

  getPriorityById(id: number): string | undefined {
    if (!this.priorities) {
      this.getAllPriority().subscribe(); // שליפה ראשונית
      return undefined;
    }
    return this.prioritiesMap[id];
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
      tap(data => {
        this.statuses = data;
        this.statusesMap = {};
        data.forEach(item => this.statusesMap[item.statusId] = item.statusName);
      })
    );
  }

  getStatusById(id: number): string | undefined {
    if (!this.statuses) {
      this.getAllStatuses().subscribe(); // שליפה ראשונית
      return undefined;
    }
    return this.statusesMap[id];
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
      tap(data => {
        this.categories = data;
        this.categoriesMap = {};
        data.forEach(item => this.categoriesMap[item.categoryId] = item.categoryName);
      })
    );
  }

  getCategoryById(id: number): string | undefined {
    if (!this.categories) {
      this.getAllCategories().subscribe(); // שליפה ראשונית
      return undefined;
    }
    return this.categoriesMap[id];
  }
}