import {
  Component, Input, Output, EventEmitter, ViewChild, OnInit, SimpleChanges
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommentsBugDto, UserDto } from 'src/app/web-api-client';
import { CommentService } from 'src/app/services/Comment.service';
import { StateService } from 'src/app/services/state.service';
import { UserProfileComponent } from "../user-profile/user-profile.component";
import { MentionDisplayComponent } from '../mention-display/mention-display.component';
import { TextEditorComponent } from '../text-editore/text-editore.component';
@Component({
  selector: 'app-comment-panel',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MentionDisplayComponent,
    TextEditorComponent
  ],
  templateUrl: './comment-panel.component.html',
  styleUrl: './comment-panel.component.css'
})
export class CommentPanelComponent implements OnInit {
  @Input() comments: Array<CommentsBugDto> = [];
  @Input() bugId: number;
  @Input() isAuthorizedToComment: boolean = false;
  @Input() currentUserName: string = '';
  @Output() closePanel = new EventEmitter<void>();

  @ViewChild('scrollContainer') scrollContainer!: any;
  @ViewChild('textEditor') textEditor!: TextEditorComponent;

  adding = false;
  userList: UserDto[] = [];
  filteredUsers: Array<UserDto> = [];
  showMentionList = false;
  selectedUserIndex: number = 0;
  caretPosition = 0;
  lastContent: string = '';

  constructor(
    private stateService: StateService,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bugId'] && this.bugId) {
      this.loadComments();
    }
  }

  onTextChanged(value: string): void {
    this.lastContent = value;
  }

  saveComment(): void {
    const html = this.textEditor.getHtml().trim();
    console.log(html);
    
    if (!html || html === '<p><br></p>') return;

    const div = document.createElement('div');
    div.innerHTML = html;

    const mentionElements = div.querySelectorAll('.ql-mention[data-id]');
    const mentionedIds = new Set<number>();
    mentionElements.forEach(el => {
      const id = el.getAttribute('data-id');
      if (id) mentionedIds.add(Number(id));
    });

    this.commentService.addComment(this.bugId, html, Array.from(mentionedIds)).subscribe({
      next: () => {
        this.loadComments();
        this.adding = false;
        this.lastContent = '';
      },
      error: (err) => console.error('שגיאה בהוספת תגובה', err)
    });
  }

  loadComments(): void {
    this.commentService.getCommentsByBugId(this.bugId).subscribe({
      next: (res) => this.comments = res,
      error: (err) => console.error('שגיאה בשליפת תגובות', err)
    });
  }

  loadUsers(): void {
    this.stateService.getAllUsers().subscribe({
      next: (users) => {
        this.userList = users;
        this.loadComments();
      },
      error: (err) => console.error('שגיאה בטעינת משתמשים:', err)
    });
  }

  deleteComment(id: number): void {
    this.commentService.deleteComment(id).subscribe(() => this.loadComments());
  }

  openAdd(): void {
    this.adding = true;
  }

  cancelAdd(): void {
    this.adding = false;
    this.lastContent = '';
  }

  close(): void {
    this.closePanel.emit();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
