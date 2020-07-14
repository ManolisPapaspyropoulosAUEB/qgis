import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitProductComponent } from './unit-product.component';

describe('UnitProductComponent', () => {
  let component: UnitProductComponent;
  let fixture: ComponentFixture<UnitProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
