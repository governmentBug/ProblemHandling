import { Component, OnInit } from '@angular/core';
import { Users } from './current-user.service';

@Component({
  selector: 'app-my-component',
  template: `<p>Current User: {{ currentUser?.name }}</p>`
})
export class MyComponent implements OnInit {
  currentUser: Users | null = null;

  constructor() { }

  ngOnInit() {
    this.currentUser = this.currentUserService.getCurrentUser();
  }
}
