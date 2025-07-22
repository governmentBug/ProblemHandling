import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentsBugDto, UserDto } from 'src/app/web-api-client';
import { CommentService, ViewComment } from 'src/app/services/Comment.service';
import { MentionModule } from 'angular-mentions';
import { StateService } from 'src/app/services/state.service';
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { MentionService } from 'src/app/services/Mention.Service';

@Component({
  selector: 'app-comment-panel',
  standalone: true,
  imports: [FormsModule, CommonModule, MentionModule, UserProfileComponent],
  templateUrl: './comment-panel.component.html',
  styleUrl: './comment-panel.component.css'
})
export class CommentPanelComponent implements OnInit {
  @Input() comments: Array<CommentsBugDto> = [];
  @Input() bugId: number;
  @Input() isAuthorizedToComment: boolean = false;
  @Input() currentUserName: string = '';
  @Output() closePanel = new EventEmitter<void>();
  @ViewChild('commentInput') commentInput!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  adding = false;
  newComment: string = '';
  userList: Array<UserDto> = [];
  mentionUserIds = new Set<number>();
  filteredUsers: Array<UserDto> = [];
  showMentionList = false;
  caretPosition = 0;
  selectedUserIndex: number = 0;
  viewComments: Array<ViewComment>
  constructor(
    private stateService: StateService,
    private commentService: CommentService,
    private mentionService: MentionService
  ) {}

  ngOnInit(): void {
    this.loadComments();
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bugId'] && this.bugId) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.commentService.getCommentsByBugId(this.bugId).subscribe({
      next: (res) => {
        this.viewComments = res.map(c => ({
          comment:c,
          renderedText: this.mentionService.processTextWithMentions(c.commentText, this.userList || [])
        }));
      },
      error: (err) => console.error('שגיאה בשליפת תגובות', err)
    });
  }

  loadUsers(): void {
    this.stateService.getAllUsers().subscribe({
      next: (users) => this.userList = users,
      error: (err) => console.error('שגיאה בטעינת משתמשים:', err)
    });
  }

  onInput(eventK: Event) {
    const event = eventK as KeyboardEvent;
    const textarea = event.target as HTMLTextAreaElement;
    this.newComment = textarea.value;
    this.caretPosition = textarea.selectionStart || 0;

    const textUpToCaret = this.newComment.substring(0, this.caretPosition);
    const match = /@([\w֐-׿]*)$/.exec(textUpToCaret);

    if (match) {
      const query = match[1];
      this.filteredUsers = this.userList.filter(user =>
        user.fullName.toLowerCase().includes(query.toLowerCase())
      );
      this.showMentionList = this.filteredUsers.length > 0;
      this.selectedUserIndex = 0;
    } else {
      this.showMentionList = false;
    }
  }

  selectUser(user: UserDto) {
    const textUpToCaret = this.newComment.substring(0, this.caretPosition);
    const textAfterCaret = this.newComment.substring(this.caretPosition);
    const mentionRegex = /@([\w֐-׿]*)$/;
    const match = mentionRegex.exec(textUpToCaret);
    if (!match) return;

    const mentionStartIndex = match.index;
    const beforeMention = this.newComment.slice(0, mentionStartIndex);
    const afterMention = textAfterCaret;

    this.newComment = `${beforeMention}@${user.fullName} ${afterMention}`.trim();
    this.caretPosition = (beforeMention + '@' + user.fullName + ' ').length;
    this.showMentionList = false;
    this.mentionUserIds.add(user.userId);
  }

  saveComment() {
    const trimmed = this.newComment.trim();
    const mentionedIds = Array.from(this.mentionUserIds);
    if (trimmed) {
      this.commentService.addComment(this.bugId, trimmed, mentionedIds).subscribe({
        next: () => {
          this.loadComments();
          this.newComment = '';
          this.adding = false;
          this.mentionUserIds.clear();
        },
        error: (err) => console.error('שגיאה בהוספת תגובה', err)
      });
    }
  }

  deleteComment(id: number) {
    this.commentService.deleteComment(id).subscribe(() => {
      this.loadComments();
    });
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
    } catch (err) {}
  }

  onKeyDown(event: KeyboardEvent) {
    if (this.showMentionList) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.selectedUserIndex = (this.selectedUserIndex + 1) % this.filteredUsers.length;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.selectedUserIndex = (this.selectedUserIndex - 1 + this.filteredUsers.length) % this.filteredUsers.length;
      } else if (event.key === 'Enter') {
        event.preventDefault();
        const selectedUser = this.filteredUsers[this.selectedUserIndex];
        if (selectedUser) {
          this.selectUser(selectedUser);
        }
      } else if (event.key === 'Escape') {
        this.showMentionList = false;
      }
    } else if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveComment();
    }
  }
}
