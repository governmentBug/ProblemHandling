
import { Component,Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BugService } from 'src/app/services/bug.service';
import { ActivatedRoute } from '@angular/router';
import { CommentPanelComponent } from "../comment-panel/comment-panel.component";
import { BugDetalsDto, CommentsBugDto } from 'src/app/web-api-client';


@Component({
    selector: 'app-bug-detail',
    standalone:true,
    imports: [CommonModule, FormsModule, CommentPanelComponent],
    templateUrl: './bug-detail.component.html',
    styleUrl: './bug-detail.component.css'
})
export class BugDetailComponent implements OnInit {
  @Input() bug!: BugDetalsDto;
  showPopup = false;
  closeReason = '';
  comments: CommentsBugDto[] = [];
  isCommentsPanelOpen = false;
  isAuthorizedToComment = false;

  constructor(private bugService:BugService,private route:ActivatedRoute) {    
  }
  ngOnInit(): void {
    this.loadComments();
    this.checkPermissions();
    
  }
  
  openPopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.closeReason = '';
  }

  submitClose() {
    if (!this.closeReason.trim()) {
      alert('אנא מלא סיבה לסגירה');
      return;
    }

    // שליחת הסיבה לשרת או הדפסתה
    console.log('סיבה לסגירת הבאג:', this.closeReason);

    // סגירת הפופאפ
    this.closePopup();
  }
  loadComments(): void {
    // this.bugService.getCommentsByBugId(this.bug.bugId).subscribe((comments) => {
    //   this.comments = comments;
    // });
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
    this.bugService.addComment()
  }

  onCommentDeleted(commentId: number): void {
    // this.bugService.deleteComment(commentId).subscribe(() => {
    //   this.loadComments();
    // });
  }

  onClosePanel(): void {
    this.isCommentsPanelOpen = false;
  }
}


