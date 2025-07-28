// mention-html-viewer.component.ts
import {
  Component, Input, ElementRef, ViewChild, AfterViewInit, ComponentRef, ViewContainerRef, Injector,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserDto } from 'src/app/web-api-client';
import { UserProfileComponent } from 'src/app/features/user-profile/user-profile.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mention-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mention-display.component.html',
  styleUrls: ['./mention-display.component.css']
})
export class MentionDisplayComponent implements OnChanges {
  @Input() html: string = '';
  @Input() users: UserDto[] = [];

  @ViewChild('container') containerRef?: ElementRef<HTMLDivElement>;
  safeHtml: SafeHtml;

  private tooltipRef?: ComponentRef<UserProfileComponent>;

  constructor(
    private sanitizer: DomSanitizer,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['html'] && this.html) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.html);
      setTimeout(() => this.bindHoverEvents(), 0); // רק אחרי שהHTML מוצג
    }
  }

  private bindHoverEvents() {
    if (!this.containerRef?.nativeElement) return;
    const container = this.containerRef.nativeElement;

    container.addEventListener('mouseover', (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('.mention, [data-id]');
      if (!el) return;

      const userId = el.getAttribute('data-id');
      const user = this.users.find(u => u.userId === Number(userId));
      if (user && !this.tooltipRef) {
        const rect = el.getBoundingClientRect();
        this.tooltipRef = this.viewContainerRef.createComponent(UserProfileComponent, {
          injector: this.injector
        });
        this.tooltipRef.instance.user = user;
        const nativeEl = this.tooltipRef.location.nativeElement as HTMLElement;
        nativeEl.style.position = 'fixed';
        nativeEl.style.top = `${rect.bottom + 5}px`;
        nativeEl.style.left = `${rect.left}px`;
        nativeEl.style.zIndex = '9999';
        document.body.appendChild(nativeEl);
      }
    });

    container.addEventListener('mouseout', () => {
      this.destroyTooltip();
    });
  }

  private destroyTooltip() {
    if (this.tooltipRef) {
      this.tooltipRef.destroy();
      this.tooltipRef = undefined;
    }
  }
}
