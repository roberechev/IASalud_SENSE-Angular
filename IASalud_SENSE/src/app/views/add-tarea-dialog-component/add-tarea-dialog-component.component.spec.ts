import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTareaDialogComponentComponent } from './add-tarea-dialog-component.component';

describe('AddTareaDialogComponentComponent', () => {
  let component: AddTareaDialogComponentComponent;
  let fixture: ComponentFixture<AddTareaDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTareaDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddTareaDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
