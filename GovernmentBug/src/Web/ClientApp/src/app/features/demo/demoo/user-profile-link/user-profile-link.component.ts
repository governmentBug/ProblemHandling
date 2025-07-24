import {
  Component,
  Input,
  ElementRef,
  ViewContainerRef,
  ApplicationRef,
  ComponentRef,
  createComponent,
  AfterViewInit,
  OnDestroy,
  Injector,
  EnvironmentInjector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDto } from 'src/app/web-api-client';
import { UserProfileComponent } from 'src/app/features/user-profile/user-profile.component';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-profile-link',
  standalone: true,
  imports: [CommonModule, UserProfileComponent],
  templateUrl: './user-profile-link.component.html',
  styleUrls: ['./user-profile-link.component.css'],
})
export class UserProfileLinkComponent {
  showPopover = false;
  @Input() user!: UserDto;

  constructor(

  ) { }
  
  startHover() {
    this.showPopover = true;
  }

  endHover() {
    this.showPopover = false;
  }

// ngAfterViewInit() {
//   const mentionEl = this.elRef.nativeElement.querySelector('.mention');
//   if (!mentionEl) return;

//   // צרי את הקומפוננטה הדינמית
//   this.componentRef = createComponent(UserProfileComponent, {
//     environmentInjector: this.environmentInjector,
//   });
//   this.componentRef.instance.user = this.user;

//   // חברי אותה ל־DOM
//   this.appRef.attachView(this.componentRef.hostView);
//   const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;

//   // הכניסי את האלמנט לקובץ זמני שממנו Bootstrap ייקח את התוכן
//   const wrapper = document.createElement('div');
//   wrapper.appendChild(domElem);

//   // צרי את הפופאובר עם תוכן HTML
//   this.popoverInstance = new bootstrap.Popover(mentionEl, {
//     content: wrapper,
//     html: true,
//     trigger: 'hover',
//     placement: 'top', // או 'auto' אם את רוצה גמישות
//     sanitize: false,  // חובה כדי לא לחסום HTML
//   });
// }

//   ngOnDestroy() {
//     if (this.popoverInstance) {
//       this.popoverInstance.dispose();
//       this.popoverInstance = undefined;
//     }
//     if (this.componentRef) {
//       this.appRef.detachView(this.componentRef.hostView);
//       this.componentRef.destroy();
//       this.componentRef = undefined;
//     }
//   }
}
