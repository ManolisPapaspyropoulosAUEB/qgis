import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerProfileComponent } from './producer-profile.component';

describe('ProducerProfileComponent', () => {
  let component: ProducerProfileComponent;
  let fixture: ComponentFixture<ProducerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
