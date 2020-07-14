import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineProducerComponent } from './timeline-producer.component';

describe('TimelineProducerComponent', () => {
  let component: TimelineProducerComponent;
  let fixture: ComponentFixture<TimelineProducerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineProducerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineProducerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
