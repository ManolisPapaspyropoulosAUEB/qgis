import {Component, Inject, OnInit} from '@angular/core';
import {ScrollService} from '../../services/scroll.service';
import {QgisMapComponent} from '../qgis-map/qgis-map.component';

@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.css']
})
export class RoadsComponent implements OnInit {


  roadsTab1=[];
  limitPage;

  constructor( private scrollService: ScrollService) { }

  ngOnInit(): void {

  }



  setParams(roadsTab1,limitPage){
    this.roadsTab1=roadsTab1;


    this.limitPage=limitPage;

    console.log(this.roadsTab1)

  }

  scrollToId(param: string) {//
    this.scrollService.scrollToElementById(param);
  }

editRoad(road){

}

  addRoadToMap(object, event){

  }

}
