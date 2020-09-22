import {Component, Inject, OnInit} from '@angular/core';
import {ScrollService} from '../../services/scroll.service';
import {QgisMapComponent} from '../qgis-map/qgis-map.component';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.css']
})
export class RoadsComponent implements OnInit {

  roadsTab1=[];
  limitPage;
  public rowHeight = 50;

  constructor( private scrollService: ScrollService,private dataservice: DataService ) { }

  ngOnInit(): void {

    this.getRoadsPyParams();
  }

  public getRoadsPyParams() {
    this.roadsTab1 = [];
    this.dataservice.getRoadsByParams(
      {
        "agriculturFacilitationFilter": "TF",
        "bridgeFilter": "TF",
        "descAsc": "asc",
        "district_id": "1401",
        "limit": "15",
        "nameFilter": "",
        "oneway": "FB",
        "orderCol": "LVRR_ID"
      }
    ).subscribe(response => {

      this.roadsTab1 = response.data;
    });
  }



}
