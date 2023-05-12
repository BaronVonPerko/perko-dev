import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlButtonsComponent } from './control-buttons.component';

describe('ControlButtonsComponent', () => {
  let component: ControlButtonsComponent;
  let fixture: ComponentFixture<ControlButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ControlButtonsComponent]
    });
    fixture = TestBed.createComponent(ControlButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
