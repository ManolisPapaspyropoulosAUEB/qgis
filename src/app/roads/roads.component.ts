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

  constructor( private scrollService: ScrollService,@Inject(QgisMapComponent) private qgisMapComponent: QgisMapComponent) { }

  ngOnInit(): void {

  }

  setParams(){
    this.roadsTab1=this.qgisMapComponent.roadsTab1;

    console.log(this.roadsTab1);

    this.limitPage=this.qgisMapComponent.limitPage;
  }

  scrollToId(param: string) {//
    this.scrollService.scrollToElementById(param);
  }

editRoad(road){
    this.qgisMapComponent.editRoad(road);
}

  addRoadToMap(object, event){
    this.qgisMapComponent.addRoadToMap(object, event);
  }

}
