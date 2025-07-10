import { Component, OnInit, SimpleChanges } from '@angular/core';
import { BugService } from '../../services/bug.service';
import { BugDetailComponent } from "../bug-detail/BugDetailComponent";
import { CommentPanelComponent } from "../comment-panel/comment-panel.component";
import { ActivatedRoute } from '@angular/router';
import { CommentService } from 'src/app/services/Comment.service';
import { BugDetalsDto, CommentsBugDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [BugDetailComponent, CommentPanelComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent implements OnInit {
  selectedBug: BugDetalsDto
  constructor(public bugService: BugService, public CommentService: CommentService, public route: ActivatedRoute) {
  }
  comments: CommentsBugDto[] = [];
  isCommentsPanelOpen = true;
  isAuthorizedToComment = true;
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const bugId = Number(params.get('id'));
      if (bugId) {
        this.getBugById(bugId);
      }
      else {
        console.error('לא נמצא מזהה באג תקין');
        this.getBugById(3); // Default to a known bug ID
      }
    });
  }

  getBugById(id: number) {
    this.bugService.getBugById(id).subscribe({
      next: bug => {
        console.log('הבאג שהתקבל:', bug);
        this.selectedBug = bug
        this.loadComments()
      },
      error: err => {
        console.error('שגיאה בשליפת באג:', err);
      }
    })
  }
  onBugChanged() {
    if (this.selectedBug) {
      this.getBugById(3);
    }
  }
  loadComments(): void {
    this.CommentService.getCommentsByBugId(this.selectedBug.bugId).subscribe({
      next: (res) => {this.comments = res
        console.log(res);
        
      },
      error: (err) => console.error('שגיאה בשליפת תגובות', err)
    });
  }

  addComment(commentText: string): void {
    this.CommentService.addComment(this.selectedBug.bugId, commentText).subscribe({
      next: () => this.loadComments(),
      error: (err) => console.error('שגיאה בהוספת תגובה', err)
    });
  }

  checkPermissions(): void {
    // this.bugService.getCurrentUserPermissions(this.bug.bugId).subscribe(res => {
    //   this.isAuthorizedToComment = res.canComment;
    // });
  }

  openCommentsPanel(): void {
    this.isCommentsPanelOpen = true;
  }

  onCommentAdded(content: string): void {
    this.addComment(content)
  }

  onCommentDeleted(commentId: number): void {
    this.CommentService.deleteComment(commentId).subscribe(() => {
      this.loadComments();
    });
  }

  onClosePanel(): void {
    this.isCommentsPanelOpen = false;
  }
}
