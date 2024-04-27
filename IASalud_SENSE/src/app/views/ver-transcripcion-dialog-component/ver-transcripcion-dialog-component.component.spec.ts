import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTranscripcionDialogComponentComponent } from './ver-transcripcion-dialog-component.component';

describe('VerTranscripcionDialogComponentComponent', () => {
  let component: VerTranscripcionDialogComponentComponent;
  let fixture: ComponentFixture<VerTranscripcionDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerTranscripcionDialogComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerTranscripcionDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
