import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineAttachmentsComponent } from './inline-attachments.component';

describe('PannelAttacmentsComponent', () => {
  let component: InlineAttachmentsComponent;
  let fixture: ComponentFixture<InlineAttachmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InlineAttachmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InlineAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
