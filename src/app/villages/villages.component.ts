import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {FilterService} from '../../services/filter.service';
@Component({
  selector: 'app-villages',
  templateUrl: './villages.component.html',
  styleUrls: ['./villages.component.css']
})
export class VillagesComponent implements OnInit {
  public num_district_code;
  public num_province_code;
  public villages=[];
  public userSelectionsForMapShow=[];
  public villageNameFilter="";
  public limit: any;
  constructor(public dataservice : DataService,public filterService : FilterService) { }
  ngOnInit(): void {
    this.limit=16;
  }
  setDistrict(currentNum_district_code: any,currentTab,current_province_code: any) {
    if( currentTab==true && current_province_code ){
      if(current_province_code==this.num_province_code && currentNum_district_code==this.num_district_code){
      }else{
        this.num_district_code=currentNum_district_code;
        this.num_province_code=current_province_code;
        this.getVillages();
      }
    }
  }



  getVillages(){

    this.dataservice.getVillages({
      "num_district_code":this.num_district_code,
      "num_province_code":this.num_province_code,
      "villageNameFilter":this.villageNameFilter
    }).subscribe(response=>{
      this.villages=response.data;
      this.villages.forEach(element=>{
        element.checked=false;
        element.checkedFilter=false;
      })

      this.userSelectionsForMapShow.forEach(e=>{
        for(var i =0;i<this.villages.length;i++){
          if(this.villages[i].id==e.id ){
            this.villages[i].checked=true;
            this.villages[i].checkedFilter=this.villages[i].checkedFilter;
          }
        }
      });
    })


  }
  public selectRow(row,event){
    if(event.checked==true){
      this.userSelectionsForMapShow.push(row);
    }else{
      for(var i=0;i< this.userSelectionsForMapShow.length;i++ ){
        if( this.userSelectionsForMapShow[i].id==row.id && this.userSelectionsForMapShow[i].Type==row.Type  ){
          this.userSelectionsForMapShow.splice(i, 1);
        }
      }
    }
    this.filterService.villagesArray=this.userSelectionsForMapShow;
    console.log( this.filterService.villagesArray);
    console.log( this.userSelectionsForMapShow);
  }

  public resetFilters(name) {
    this.villageNameFilter=name;
    this.limit=16;
    this.filterService.villageNameFilter=name;
    this.filterService.villageLimitTab=16
    ;
    this.getVillages();
  }
  updateFilters(villageNameFilter: string) {
    console.log(villageNameFilter);
    this.villageNameFilter=villageNameFilter;
    this.getVillages();
  }

  public  setLimit(villageLimkt) {
    this.limit= villageLimkt;
    this.filterService.villageLimitTab=villageLimkt;
  }
  selectAllCheckMethod(selectAllCheckFacilities: any) {
    if(selectAllCheckFacilities){
      this.villages.forEach(element=>{
        element.checked=false;
        this.userSelectionsForMapShow=[];
      });
    }else{
      this.villages.forEach(element=>{
        console.log(element);
        element.checked=true;
        this.userSelectionsForMapShow.push(element);
      });
    }

    this.filterService.villagesArray=this.userSelectionsForMapShow;

  }
}
