import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LightMoodComponent } from './light-mood.component';

describe('LightMoodComponent', () => {
  let component: LightMoodComponent;
  let fixture: ComponentFixture<LightMoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightMoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightMoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
