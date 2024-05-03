import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAudioTareaDialogComponentComponent } from './add-audio-tarea-dialog-component.component';

describe('AddAudioTareaDialogComponentComponent', () => {
  let component: AddAudioTareaDialogComponentComponent;
  let fixture: ComponentFixture<AddAudioTareaDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAudioTareaDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAudioTareaDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
