import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MentionDisplayComponent } from '../mention-display/mention-display.component';
import { StateService } from 'src/app/services/state.service';
import { UserDto } from 'src/app/web-api-client';

@Component({
  selector: 'app-mention-input',
  standalone: true,
  imports: [CommonModule, FormsModule, MentionDisplayComponent],
  templateUrl: './mention-input.component.html',
  styleUrls: ['./mention-input.component.css']
})
export class MentionInputComponent implements OnInit {
  constructor(private stateService: StateService) {}

  text: string = 'היי @lea, מה קורה עם @david ו-@someoneElse?';
  users: UserDto[] = [];

  ngOnInit(): void {
    this.stateService.getAllUsers().subscribe((r) => {
      this.users = r;
      console.log(r);
    });
  }

 // mention-input.component.ts (רק שינוי קטן בפונקציה)
onContentChange(event: Event) {
  const target = event.target as HTMLElement;
  this.text = target.innerText;
}

}

  