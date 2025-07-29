import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorComponent } from './text-editore.component';

describe('TextEditoreComponent', () => {
  let component: TextEditorComponent;
  let fixture: ComponentFixture<TextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
