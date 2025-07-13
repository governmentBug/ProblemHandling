import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSameBugsComponent } from './search-same-bugs.component';

describe('SearchSameBugsComponent', () => {
  let component: SearchSameBugsComponent;
  let fixture: ComponentFixture<SearchSameBugsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSameBugsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSameBugsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
