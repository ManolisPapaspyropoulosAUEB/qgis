import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeConsumerComponent } from './home-consumer.component';

describe('HomeConsumerComponent', () => {
  let component: HomeConsumerComponent;
  let fixture: ComponentFixture<HomeConsumerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeConsumerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeConsumerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
