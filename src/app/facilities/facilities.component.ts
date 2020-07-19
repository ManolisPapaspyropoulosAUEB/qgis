import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {FilterService} from '../../services/filter.service';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.css']
})




export class FacilitiesComponent implements OnInit {
  public Dist_Code;
  public currentTab;
  public facilitiesMerged=[];
  public finalfacilitiesMerged=[];
  limit;
  public dataDistCenters=[];
  public dataSchools=[];
  public dataMosques=[];
  public num_district_code;
  public num_province_code;
  public type;
  public userSelectionsForMapShow=[];
  ngOnInit(): void {
    this.type="Both";
    this.limit=16;
  }
  constructor(public dataservice : DataService,public filterService : FilterService) {
  }
  public test (){
  }
  public getFacilities(){
    this.dataservice.get_facilities({
      "num_district_code":this.num_district_code,
      "num_province_code":this.num_province_code,
      "type":this.type
    }).subscribe(response=>{
      this.finalfacilitiesMerged=[];
      this.facilitiesMerged=[];
      // this.facilities=response.data;
      this.dataDistCenters=response.dataDistCenters;
      this.dataSchools=response.dataSchools;
      this.dataMosques=response.dataMosques;
      console.log(this.type);
      if(this.type=='Both'){
        this.dataDistCenters.forEach(element=>{
          this.facilitiesMerged.push({
            "Pro_Name":element.Pro_Name,
            "NAME":"",
            "Pro_Center":element.Pro_Center,
            "Pro_Code":element.Pro_Code,
            "Dist_Name":element.Dist_Name,
            "Dist_Code":element.Dist_Code,
            "Center_Typ":element.Center_Typ,
            "East":element.East,
            "id":element.id,
            "customId":element.id+"distcenters",
            "North":element.North,
            "East_UTM42":element.East_UTM42,
            "Nort_UTM42":element.Nort_UTM42,
            "main_type":"distcenters",
            "From_":"",
            "checked":false,
            "checkedFilter":false,
            "Type":"distcenters"
          });
        });
        this.dataMosques.forEach(element=>{
          this.facilitiesMerged.push({
            "Pro_Name":"",
            "NAME":element.NAME,
            "Pro_Center":"",
            "Pro_Code":"",
            "id":element.id,
            "Dist_Name":"",
            "customId":element.id+element.Type,
            "Dist_Code":"",
            "Center_Typ":"",
            "East":element.East,
            "North":element.North,
            "East_UTM42":element.East_UTM42,
            "Nort_UTM42":element.Nort_UTM42,
            "main_type":"mosques",
            "checked":false,
            "checkedFilter":false,

            "From_":element.From_,
            "Type":element.Type,
          });
        });
        this.dataSchools.forEach(element=>{
          this.facilitiesMerged.push({
            "Pro_Name":"",
            "NAME":element.NAME,
            "Pro_Center":"",
            "Pro_Code":"",
            "Dist_Name":"",
            "Dist_Code":"",
            "customId":element.id+element.Type,
            "Center_Typ":"",
            "East":element.East,
            "id":element.id,
            "North":element.North,
            "East_UTM42":element.East_UTM42,
            "Nort_UTM42":element.Nort_UTM42,
            "main_type":"schools",
            "From_":element.From_,
            "checked":false,
            "checkedFilter":false,
            "Type":element.Type,
          });
        });
      }else if (this.type=='Schools'){
        this.dataSchools.forEach(element=>{
          this.facilitiesMerged.push({
            "Pro_Name":"",
            "NAME":element.NAME,
            "Pro_Center":"",
            "Pro_Code":"",
            "Dist_Name":"",
            "Dist_Code":"",
            "Center_Typ":"",
            "East":element.East,
            "id":element.id,
            "North":element.North,
            "East_UTM42":element.East_UTM42,
            "Nort_UTM42":element.Nort_UTM42,
            "main_type":"schools",
            "From_":element.From_,

            "checked":false,
            "checkedFilter":false,
            "Type":element.Type,
          });
        });
      }else if (this.type=='Mosques'){
        this.dataMosques.forEach(element=>{

          this.facilitiesMerged.push({
            "Pro_Name":"",
            "NAME":element.NAME,
            "Pro_Center":"",
            "Pro_Code":"",
            "id":element.id,
            "Dist_Name":"",
            "Dist_Code":"",
            "Center_Typ":"",
            "East":element.East,
            "North":element.North,
            "East_UTM42":element.East_UTM42,
            "Nort_UTM42":element.Nort_UTM42,
            "main_type":"mosques",
            "checked":false,
            "checkedFilter":false,
            "From_":element.From_,
            "Type":element.Type,
          });

        });
      }else if (this.type=='Distcenters') {
        this.dataDistCenters.forEach(element=>{
          this.facilitiesMerged.push({
            "Pro_Name":element.Pro_Name,
            "NAME":"",
            "Pro_Center":element.Pro_Center,
            "Pro_Code":element.Pro_Code,
            "Dist_Name":element.Dist_Name,
            "Dist_Code":element.Dist_Code,
            "Center_Typ":element.Center_Typ,
            "East":element.East,
            "id":element.id,
            "North":element.North,
            "East_UTM42":element.East_UTM42,
            "Nort_UTM42":element.Nort_UTM42,
            "main_type":"distcenters",
            "From_":"",
            "checked":false,
            "checkedFilter":false,
            "Type":"distcenters"
          });

        });
      }
      this.finalfacilitiesMerged=this.facilitiesMerged;
      this.userSelectionsForMapShow.forEach(e=>{
        for(var i =0;i<this.finalfacilitiesMerged.length;i++){
          if(this.finalfacilitiesMerged[i].main_type==e.main_type &&  this.finalfacilitiesMerged[i].id==e.id ){
            this.finalfacilitiesMerged[i].checked=true;
            this.finalfacilitiesMerged[i].checkedFilter=this.finalfacilitiesMerged[i].checkedFilter;
          }
        }
      });
      window.dispatchEvent(new Event('resize'));

    });
  }

  public getFiltersType(type){
    this.type=type;
    this.getFacilities();
  }



  setDistrict(currentNum_district_code: any,currentTab,current_province_code: any) {
    if( currentTab==true && current_province_code ){
      if(current_province_code==this.num_province_code && currentNum_district_code==this.num_district_code){
      }else{
        this.num_district_code=currentNum_district_code;
        this.num_province_code=current_province_code;
        this.getFacilities();
      }
    }
  }

  public selectRow(row,event){

    console.log(row);

    if(event.checked==true){
      this.userSelectionsForMapShow.push(row);
    }else{
      row.checkedFilter=false;
      for(var i=0;i< this.userSelectionsForMapShow.length;i++ ){
        if( this.userSelectionsForMapShow[i].id==row.id && this.userSelectionsForMapShow[i].Type==row.Type  ){
          this.userSelectionsForMapShow.splice(i, 1);

        }
      }
    }
    this.filterService.facilitiesArray=this.userSelectionsForMapShow;
  }

 public  setLimit(FacilitislimitPage) {
    this.limit= FacilitislimitPage;
    this.filterService.facilitiesLimitTab=FacilitislimitPage;
  }

  public resetFilters(type) {
    this.type=type;
    this.limit=16;
    this.filterService.facilitiesLimitTab=16;
    this.filterService.facilitiesType=type;
    this.getFacilities();
  }

  selectAllCheckMethod(selectAllCheckFacilities: any) {
    if(selectAllCheckFacilities){
      this.finalfacilitiesMerged.forEach(element=>{
        element.checked=false;
        this.userSelectionsForMapShow=[];
      });
    }else{
      this.finalfacilitiesMerged.forEach(element=>{
        console.log(element);
        element.checked=true;
        this.userSelectionsForMapShow.push(element);
      });
    }
    this.filterService.facilitiesArray=this.userSelectionsForMapShow;
  }
}
