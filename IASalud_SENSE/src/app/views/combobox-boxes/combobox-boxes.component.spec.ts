import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxBoxesComponent } from './combobox-boxes.component';

describe('ComboboxBoxesComponent', () => {
  let component: ComboboxBoxesComponent;
  let fixture: ComponentFixture<ComboboxBoxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboboxBoxesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComboboxBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
