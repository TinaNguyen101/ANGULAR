import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterAnnualEvaluatorsComponent } from './master-annual-evaluators.component';

describe('MasterAnnualEvaluatorsComponent', () => {
  let component: MasterAnnualEvaluatorsComponent;
  let fixture: ComponentFixture<MasterAnnualEvaluatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterAnnualEvaluatorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterAnnualEvaluatorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
