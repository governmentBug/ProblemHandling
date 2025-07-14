import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByStatusComponent } from './by-status.component';

describe('ByStatusComponent', () => {
  let component: ByStatusComponent;
  let fixture: ComponentFixture<ByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ByStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
