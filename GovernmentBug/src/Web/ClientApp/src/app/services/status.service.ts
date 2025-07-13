import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Status } from '../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  constructor(public StatusServer: HttpClient) { }
  public selectedStatus: Status | null = null;

      getAllStatus(): Observable<Array<Status>> {
      const createUrl: string = "https://localhost:5001/api/Status";
      return this.StatusServer.get<Array<Status>>(createUrl); 
    }
}