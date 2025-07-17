import { Injectable } from "@angular/core";
import { AttachmentBugDto, AttachmentsClient } from "../web-api-client";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  constructor(private AttClient:AttachmentsClient,private http:HttpClient) {}
 createAttachments(files:File[],bugId:number) {
    const formData = new FormData();
    formData.append('BugId', bugId.toString());
    files.forEach((file, index) => {
      formData.append(`Files[${index}].File`, file, file.name);
      formData.append(`Files[${index}].IsFilm`, 'false'); 
    });

     this.http.post('/api/Attachments/create', formData).subscribe({
      next: (r) => {alert('הקבצים הועלו בהצלחה!')
        console.log(r);
      },
      error: err => console.error('שגיאה בהעלאה', err)
    });

  }
  getAttachmentsBug(BugId:number): Observable<Array<AttachmentBugDto>> {
    return this.AttClient.getAttachmentsByBugID(BugId);
  }
  getAttachmentsByBug(bugId: number): Observable<AttachmentBugDto[]> {
  return this.AttClient.listAttachmentsByBug(bugId);
}

getFileContent(id: number): Observable<Blob> {
  const url = `https://localhost:5001/api/attachments/download/${id}`;
  return this.http.get(url, { responseType: 'blob' });
}
/** בקשה בפועל להורדת Blob */
getBlobUrl(id: number, mime: string) {
  return this.http.get(this.downloadUrl(id), { responseType: 'blob' })
    .pipe(map(blob => {
      // אם את חייבת base64→Uint8Array→createPreviewUrl:
      // const fr = new FileReader();
      // ... אבל ObjectURL יותר פשוט:
      return URL.createObjectURL(blob);
    }));
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

  /** רשימת קבצים (מטא‑דאטה קל) */
  getByBug(bugId: number): Observable<AttachmentBugDto[]> {
    return this.AttClient.getAttachmentsByBugID(bugId);
  }

  /** URL מלא להורדת קובץ מה‑API */
  downloadUrl(id: number): string {
    return `/attachments/download/${id}`;          // או environment.api + …
  }

  /** תצוגה מקומית לקבצים חדשים שעדיין לא הועלו */
  localPreview(file: File): string {
    return URL.createObjectURL(file);              // ביטול ב‑ngOnDestroy
  }


  isImage(type: string)  { return type.startsWith('image/'); }
  isVideo(type: string)  { return type.startsWith('video/'); }
}
