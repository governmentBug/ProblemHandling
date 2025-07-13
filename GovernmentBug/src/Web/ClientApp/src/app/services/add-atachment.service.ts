import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AttachmentsClient } from '../web-api-client';
import { AddAtachment } from '../models/add-atachment.module';

@Injectable({
  providedIn: 'root'
})
export class AddDocumentService {

  constructor(public AttachmentServer: HttpClient) { }
  // public selectedPriority:  | null = null;
  AddAtachment(addAtachment: AddAtachment): Observable<AddAtachment> {
    const createUrl: string = "https://localhost:5001/api/Attachments";
    return this.AttachmentServer.post<AddAtachment>(createUrl, addAtachment);
  }
}