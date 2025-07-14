import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Priority } from '../models/priority.model';

@Injectable({
  providedIn: 'root'
})
export class PriorityService {
  constructor(public PriorityServer: HttpClient) { }
  public selectedPriority: Priority | null = null;

  getAllPriority(): Observable<Array<Priority>> {
    const createUrl: string = "https://localhost:5001/api/Priority";
    return this.PriorityServer.get<Array<Priority>>(createUrl);
  }
}