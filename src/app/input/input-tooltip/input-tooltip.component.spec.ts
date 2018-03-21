import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputTooltipComponent } from './input-tooltip.component';

describe('InputTooltipComponent', () => {
  let component: InputTooltipComponent;
  let fixture: ComponentFixture<InputTooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputTooltipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
