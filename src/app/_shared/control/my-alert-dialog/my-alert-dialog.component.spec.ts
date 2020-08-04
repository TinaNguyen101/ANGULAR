import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAlertDialogComponent } from './my-alert-dialog.component';

describe('MyAlertDialogComponent', () => {
  let component: MyAlertDialogComponent;
  let fixture: ComponentFixture<MyAlertDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAlertDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
