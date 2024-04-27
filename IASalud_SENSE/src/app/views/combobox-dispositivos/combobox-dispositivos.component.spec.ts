import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxDispositivosComponent } from './combobox-dispositivos.component';

describe('ComboboxDispositivosComponent', () => {
  let component: ComboboxDispositivosComponent;
  let fixture: ComponentFixture<ComboboxDispositivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboboxDispositivosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComboboxDispositivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
