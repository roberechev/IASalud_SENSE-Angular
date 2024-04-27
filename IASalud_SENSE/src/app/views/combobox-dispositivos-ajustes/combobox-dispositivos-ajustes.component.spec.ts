import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxDispositivosAjustesComponent } from './combobox-dispositivos-ajustes.component';

describe('ComboboxDispositivosAjustesComponent', () => {
  let component: ComboboxDispositivosAjustesComponent;
  let fixture: ComponentFixture<ComboboxDispositivosAjustesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboboxDispositivosAjustesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComboboxDispositivosAjustesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
