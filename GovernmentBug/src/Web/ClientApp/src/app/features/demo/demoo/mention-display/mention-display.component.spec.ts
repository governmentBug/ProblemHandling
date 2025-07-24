import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionDisplayComponent } from './mention-display.component';

describe('MentionDisplayComponent', () => {
  let component: MentionDisplayComponent;
  let fixture: ComponentFixture<MentionDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentionDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
