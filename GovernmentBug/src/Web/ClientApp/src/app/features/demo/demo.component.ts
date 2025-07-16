import { Component, OnInit, SimpleChanges } from '@angular/core';
import { BugService } from '../../services/bug.service';
import { BugDetailComponent } from "../bug-detail/BugDetailComponent";
import { CommentPanelComponent } from "../comment-panel/comment-panel.component";
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/services/Comment.service';
import { BugDetalsDto, CommentsBugDto } from 'src/app/web-api-client';
import { AttachmentService } from 'src/app/services/Attachment.Service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent implements OnInit {
  
  constructor(private AtttachmentService:AttachmentService,private http:HttpClient) {
   
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  bugId: number;
  files: File[] = [];

  onFileSelected(event: any) {
    const selectedFiles = event.target.files as FileList;
    this.files = Array.from(selectedFiles);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('BugId', this.bugId.toString());

    this.files.forEach((file, index) => {
      formData.append(`Files[${index}].File`, file, file.name);
      formData.append(`Files[${index}].IsFilm`, 'false'); // שנה לפי הצורך
    });

    this.http.post('/api/Attachments/create', formData).subscribe({
      next: (r) => {alert('הקבצים הועלו בהצלחה!')
        console.log(r);
        
      },
      error: err => console.error('שגיאה בהעלאה', err)
    });
  }

}
