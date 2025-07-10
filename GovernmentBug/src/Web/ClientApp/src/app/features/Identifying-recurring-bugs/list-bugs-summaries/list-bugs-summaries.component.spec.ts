import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBugsSummariesComponent } from './list-bugs-summaries.component';

describe('ListBugsSummariesComponent', () => {
  let component: ListBugsSummariesComponent;
  let fixture: ComponentFixture<ListBugsSummariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListBugsSummariesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBugsSummariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
