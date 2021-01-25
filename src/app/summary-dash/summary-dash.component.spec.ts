import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryDashComponent } from './summary-dash.component';

describe('SummaryDashComponent', () => {
  let component: SummaryDashComponent;
  let fixture: ComponentFixture<SummaryDashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryDashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
