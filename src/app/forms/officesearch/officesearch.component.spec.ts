import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficesearchComponent } from './officesearch.component';

describe('OfficesearchComponent', () => {
  let component: OfficesearchComponent;
  let fixture: ComponentFixture<OfficesearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficesearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficesearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
