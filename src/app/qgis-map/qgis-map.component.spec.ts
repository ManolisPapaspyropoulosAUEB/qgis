import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QgisMapComponent } from './qgis-map.component';

describe('QgisMapComponent', () => {
  let component: QgisMapComponent;
  let fixture: ComponentFixture<QgisMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QgisMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QgisMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
