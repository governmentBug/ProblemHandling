import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bug } from '../models/bug.model';
import { CommentService } from './Comment.service';
import { BugDetalsDto, BugsClient, CategoryClient, PriorityClient, StatusClient, UpdateBugAndClosedCommand, UpdateBugCommand } from '../web-api-client';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  basicUrl: string = "https://localhost:5001/api/Bugs/all";
  constructor( public PriorityClient: PriorityClient,public StatusClient: StatusClient,public CategoryClient: CategoryClient,) { 

  }
  getAllPriority() {
    return this.PriorityClient.getAllPriorities();
  }

  // שליפת כל הסטטוסים
  getAllStatuses() {
    return this.StatusClient.getAllStatuses();
  }

  // שליפת כל הקטגוריות
  getAllCategories() {
    return this.CategoryClient.getAllCategories();
  }

}