import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelHelperComponent } from './label-helper.component';

describe('LabelHelperComponent', () => {
  let component: LabelHelperComponent;
  let fixture: ComponentFixture<LabelHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
