import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PannelAttacmentsComponent } from './pannel-attacments.component';

describe('PannelAttacmentsComponent', () => {
  let component: PannelAttacmentsComponent;
  let fixture: ComponentFixture<PannelAttacmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PannelAttacmentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PannelAttacmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
