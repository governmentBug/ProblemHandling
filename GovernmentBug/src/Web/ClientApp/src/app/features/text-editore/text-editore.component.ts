import {
  Component, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter, ComponentRef, ViewContainerRef, Injector
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Quill from 'quill';
import 'quill-mention';
import 'quill-emoji';
import { UserDto } from 'src/app/web-api-client';
import { UserProfileComponent } from 'src/app/features/user-profile/user-profile.component';

(window as any).Quill = Quill;

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [CommonModule, UserProfileComponent],
  templateUrl: './text-editore.component.html',
  styleUrls: ['./text-editore.component.css']
})
export class TextEditorComponent implements AfterViewInit {
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;
  @Input() users: UserDto[] = [];
  @Output() contentChanged = new EventEmitter<string>();
  @Output() enterPressed = new EventEmitter<void>();

  private tooltipRef?: ComponentRef<UserProfileComponent>;
  private quillInstance: Quill;
  forMention: boolean = false
  constructor(private viewContainerRef: ViewContainerRef, private injector: Injector) { }

  ngAfterViewInit(): void {
    this.quillInstance = new Quill(this.editorRef.nativeElement, {
      theme: 'snow',
      placeholder: 'כתוב תגובה...',
      modules: {
        toolbar: [],
        'emoji-toolbar': false,
        mention: {
          mentionDenotationChars: ['@'],
          isolateCharacter: true,
          source: (searchTerm: string, renderList: Function) => {
            const matches = this.users
              .filter(u => u.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
              .map(u => ({
                id: u.userId,
                value: u.fullName,
                fullName: u.fullName,
                email: u.email,
                avatar: '',
                link: `/user/${u.userId}`
              }));
            renderList(matches, searchTerm);
          },
          onSelect: (item: any, insertItem: Function) => {
            this.forMention = true;
            insertItem(item);
            setTimeout(() => {
              const mentions = this.editorRef.nativeElement.querySelectorAll('.ql-mention');
              const lastMention = mentions[mentions.length - 1];
              if (lastMention) {
                lastMention.setAttribute('data-id', item.id);
                lastMention.classList.add('mention');
              }

              this.forMention = false;
            }, 100);

          },
          renderItem: (item: any) => {
            return `
              <div class="mention-item" data-id="${item.id}">
                <div class="mention-name">
                  <i class="fas fa-user-circle" style="font-size: 1.2rem; color: gray; border-radius: 50%; background-color: #eee; padding: 2px;"></i>
                  ${item.email}
              </div>
            `;
          }
        }
      }
    });
    this.quillInstance.on('text-change', () => {
      const html = this.getHtml();
      this.contentChanged.emit(html);
    });
    this.quillInstance.root.addEventListener('mouseover', (e: MouseEvent) => {
      let mention = (e.target as HTMLElement).closest('.mention, [data-id]');
      if (mention) {
        const userId = mention.getAttribute('data-id');
        const user = this.users.find(u => u.userId == Number(userId));
        if (user && !this.tooltipRef) {
          const rect = mention.getBoundingClientRect();
          this.tooltipRef = this.viewContainerRef.createComponent(UserProfileComponent, {
            injector: this.injector
          });
          this.tooltipRef.instance.user = user;
          const el = this.tooltipRef.location.nativeElement as HTMLElement;
          el.style.position = 'fixed';
          el.style.top = `${rect.bottom + 5}px`;
          el.style.left = `${rect.left}px`;
          el.style.zIndex = '9999';
          document.body.appendChild(el);
        }
      }
    });
    this.quillInstance.root.addEventListener('mouseout', () => {
      this.destroyTooltip();
    });
    this.quillInstance.root.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey && !event.defaultPrevented) {
        if (!this.forMention) {
          event.preventDefault();
          this.enterPressed.emit();
        }
      }
    });
  }

  getHtml(): string {
    return this.editorRef.nativeElement.querySelector('.ql-editor')?.innerHTML || '';
  }

  private destroyTooltip() {
    if (this.tooltipRef) {
      this.tooltipRef.destroy();
      this.tooltipRef = undefined;
    }
  }
}
