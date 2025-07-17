import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentsBugDto } from 'src/app/web-api-client';
import { CommentService } from 'src/app/services/Comment.service';

@Component({
  selector: 'app-comment-panel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './comment-panel.component.html',
  styleUrl: './comment-panel.component.css'
})
export class CommentPanelComponent implements OnInit {
  @Input() comments: Array<CommentsBugDto>
  @Input() bugId: number
  @Input() isAuthorizedToComment: boolean = false;
  @Input() currentUserName: string = '';
  @Output() closePanel = new EventEmitter<void>();
  @ViewChild('commentInput') commentInput!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  adding = false;
  newComment: string = '';
  constructor(private CommentService: CommentService) { }
  ngOnInit(): void {
      this.loadComments()
  }
  ngOnChanges(changes: SimpleChanges): void {
  if(changes['isEditMode']&& this.bugId)
    this.loadComments()
  if (changes['bugId'] && this.bugId) {
    this.loadComments();
  }
}
  loadComments(): void {
    this.CommentService.getCommentsByBugId(this.bugId).subscribe({
      next: (res) => {
        this.comments = res
        console.log(res);

      },
      error: (err) => console.error('שגיאה בשליפת תגובות', err)
    });
  }
  saveComment() {
    const trimmed = this.newComment.trim();
    if (trimmed) {
      this.CommentService.addComment(this.bugId, trimmed).subscribe({
        next: () => {
          this.loadComments()
          this.newComment = '';
          this.adding = false;
        },
        error: (err) => console.error('שגיאה בהוספת תגובה', err)
      });
    }
  }
  deleteComment(id: number) {
    this.CommentService.deleteComment(id).subscribe(() => {
      this.loadComments();
    })
  }

  openAdd() {
    this.adding = true;
    setTimeout(() => {
      this.commentInput?.nativeElement?.focus();
    });
  }

  cancelAdd() {
    this.adding = false;
    this.newComment = '';
  }

  close() {
    this.closePanel.emit();
  }
  
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  handleEnter(event) {
    if (!event.shiftKey) {
      event.preventDefault();
      this.saveComment();
    }
  }

}
