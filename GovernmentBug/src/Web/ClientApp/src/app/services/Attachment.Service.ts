import { Injectable } from "@angular/core";
import { AttachmentBugDto, AttachmentsClient } from "../web-api-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  constructor(private AttClient:AttachmentsClient) {}

//   uploadAttachment(file: File): Observable<any> {
//     const formData = new FormData();
//     formData.append('file', file);

//     return this.http.post('/api/attachments', formData);
//   }

// createAttachment(formData:FormData):Observable<any>{
//   return this.AttClient.createAttachments()
// }
  getAttachmentsBug(BugId:number): Observable<Array<AttachmentBugDto>> {
    return this.AttClient.getAttachmentsByBugID(BugId);
  }

  deleteAttachment(id: number): Observable<any> {
    return this.AttClient.deleteAttachment(id);
  }
  //פונקציות להמרת קבצים
  
base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
  createPreviewUrl(fileBytes: Uint8Array, fileType: string): string {
    const blob = new Blob([new Uint8Array(fileBytes)], { type: fileType });
    return URL.createObjectURL(blob);
  }

  isImage(fileType: string): boolean {
    return fileType?.startsWith('image/');
  }

  isVideo(fileType: string): boolean {
    return fileType?.startsWith('video/');
  }

}