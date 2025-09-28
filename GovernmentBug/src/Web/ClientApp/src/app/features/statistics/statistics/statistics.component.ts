import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent {
  selectedTab: 'dashboard' | 'personal' = 'dashboard';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.firstChild?.url.subscribe(url => {
      if (url.length > 0) {
        this.selectedTab = url[0].path === 'dashboard' ? 'dashboard' : 'personal';
      }
    });
  }

  selectTab(tab: 'dashboard' | 'personal') {
    this.selectedTab = tab;
    this.router.navigate([tab], { relativeTo: this.route });
  }
}
