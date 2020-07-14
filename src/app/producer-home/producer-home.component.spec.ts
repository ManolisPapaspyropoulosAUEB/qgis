import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducerHomeComponent } from './producer-home.component';

describe('ProducerHomeComponent', () => {
  let component: ProducerHomeComponent;
  let fixture: ComponentFixture<ProducerHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProducerHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
