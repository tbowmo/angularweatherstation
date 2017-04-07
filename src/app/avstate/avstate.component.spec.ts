import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvstateComponent } from './avstate.component';

describe('AvstateComponent', () => {
  let component: AvstateComponent;
  let fixture: ComponentFixture<AvstateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvstateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvstateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
