import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxPacientesComponent } from './combobox-pacientes.component';

describe('ComboboxPacientesComponent', () => {
  let component: ComboboxPacientesComponent;
  let fixture: ComponentFixture<ComboboxPacientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboboxPacientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComboboxPacientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
