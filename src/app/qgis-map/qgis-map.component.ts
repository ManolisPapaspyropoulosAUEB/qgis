import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
import {ColumnMode, NgxDatatableModule} from '@swimlane/ngx-datatable';
import * as L from 'leaflet';
// import * as Le2 from 'leaflet/dist/bundle.js';
// import FILTER from 'filter-search';
import {json_Khost_Province_Baak_District_OSM_roads_UTM42n_2} from './data/Khost_Province_Baak_District_OSM_roads_UTM42n_2';
import {json_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3} from './data/Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3';
import {json_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4} from './data/Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4';
import {json_Khost_Province_Khost_District_OSM_roads_UTM42n_5} from './data/Khost_Province_Khost_District_OSM_roads_UTM42n_5';
import {json_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6} from './data/Khost_Province_Manduzay_District_OSM_roads_UTM42n_6';
import {json_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7} from './data/Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7';
import {json_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8} from './data/Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8';
import {json_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9} from './data/Khost_Province_Qalandar_District_OSM_roads_UTM42n_9';
import {json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10} from './data/Khost_Province_Sabari_District_OSM_roads_UTM42n_10';
import {json_Khost_Province_Shamul_District_OSM_roads_UTM42n_11} from './data/Khost_Province_Shamul_District_OSM_roads_UTM42n_11';
import {json_Khost_Province_Spera_District_OSM_roads_UTM42n_12} from './data/Khost_Province_Spera_District_OSM_roads_UTM42n_12';
import {json_Khost_Province_Tanay_District_OSM_roads_UTM42n_13} from './data/Khost_Province_Tanay_District_OSM_roads_UTM42n_13';
import {json_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14} from './data/Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14';
import {json_KhostProvincedistrictsKhost_Province_UTM42n_1} from './data/KhostProvincedistrictsKhost_Province_UTM42n_1';
import Autolinker from 'autolinker';
import {DataService} from '../../services/data.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {FacilitiesComponent} from '../facilities/facilities.component';
import {FilterService} from '../../services/filter.service';
import {VillagesComponent} from '../villages/villages.component';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MatDrawer} from '@angular/material/sidenav';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ScrollService} from '../../services/scroll.service';

interface Options {
  width?: number, height?: number, left?: number, top?: number, toolbar?: number, location?: number;
}



@Component({
  selector: 'app-qgis-map',
  templateUrl: './index.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./index.component.scss']
})
export class QgisMapComponent implements OnInit, AfterViewInit {
  title = 'Look jQuery Animation working in action!';
  public myMap;
  public roads = [];
  public roadsTab1 = [];
  public headerHeight = 50;
  public mcaActive ;


  public rowHeight = 50;
  public pageLimit = 10;
  public searchTextRoads: "";
  public searchTextFacilities: "";
  public searchTextVillages: "";
  public roadsToMap = [];
  public selectAllCheck;
  public selectAllCheckFacilities;
  public showOnMapWidth;




  public roadWayRadio;
  public typeFacilities = this.filterService.facilitiesType;
  public villageNameFilter = this.filterService.villageNameFilter;
  public limitPage;
  public limitScroll;
  public FacilitislimitPage = this.filterService.facilitiesLimitTab;
  public villageLimitPage = this.filterService.villageLimitTab;
  province: any = '';
  district: any = '';
  road: any = '';
  dropdownSettings2 = {
    singleSelection: true,
    badgeShowlimitPage: 3,
    enableSearchFilter: true,
    text: 'Select Province',
    searchPlaceholderText: 'Search',
    primaryKey: 'num_province_code',
    enableCheckAll: false
  };

  dropdownSettings3 = {
    singleSelection: true,
    badgeShowlimitPage: 3,
    enableSearchFilter: true,
    text: 'Select District',
    searchPlaceholderText: 'Search',
    primaryKey: 'num_district_code',
    enableCheckAll: false
  };

  public provinces = [];
  public unclassifiedCheck;
  public primaryCheck;
  public secondaryCheck;
  public tertiaryCheck;
  public maxSpeedFilter;
  public roadTab2 = [];
  public districts = [];
  public nameFilter = '';
  public bridgeFilter = '';
  public concreteFilter;
  public sand_or_gravelFilter;
  public asphaltFilter;
  public districtsTabRoads = [];
  public selectedValuesFclass = [];
  public selectedValuesRoadCondition = [];
  public agriculturFacilitationFilter = '';
  public markers = [];
  public layer_KhostProvincedistrictsKhost_Province_UTM42n_1;
  public layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3;
  public layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3;
  public diakopthsDromwn = true;
  private layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14: L.geoJson;
  public currentNum_district_code: any;
  public currentProvinceCode: any;
  private sqlInFclass;
  private sqlInRoadConditions;
  public tab;
  public currentStatus;
  public currentStatusMapSelection;
  public selectAllCheckVillages;
  private roadsTab1Cpy = [];
  public selectionArrayRoads;
  public layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8: L.geoJson;
  constructor(private  dataservice: DataService, public filterService: FilterService,private snackBar: MatSnackBar,public dialog: MatDialog,private scrollService: ScrollService) {
  }

  @ViewChild('mydatatable') mydatatable;

  @ViewChild('fclassSelect') fclassSelect;
  @ViewChild('roadConditionSelect') roadConditionSelect;
  @ViewChild(FacilitiesComponent) facilitiesComponent: FacilitiesComponent;
  @ViewChild(VillagesComponent) villagesComponent: VillagesComponent;
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('drawerMapSelections') drawerMapSelections: MatDrawer;
  public resetFilters() {
    this.roadWayRadio = 'FB';
    this.bridgeFilter = 'TF';
    this.agriculturFacilitationFilter = 'TF';
    this.fclassSelect.update.emit([]);
    this.roadConditionSelect.update.emit([]);
    this.nameFilter = '';
    this.maxSpeedFilter = '';
    this.sqlInFclass = '()';
    this.sqlInRoadConditions = '()';
    this.getRoadsPyParams();
  }

  private windowHandle: Window;
  private windowFeatures: Options = { width: 500, height: 500, left: 0, top: 0, location: 0 }
  public onClick2() {
    this.windowHandle = this.createNewWindow('http://admin.synergic.gr:9030/', 'newWindow', this.windowFeatures);
  }
  private createNewWindow(url: string, name = 'newWindow', options: Options) {
    if (url == null) {
      return null;
    }
    const features = `width=${options.width},height=${options.height},left=${options.left},top=${options.top},location=${options.location},toolbar=${options.toolbar}`;
    return window.open(url, name, features);
  }
  //
  public ngOnInit() {
    this.showOnMapWidth=100;
    this.mcaActive=true;
    this.rowHeight=50;

    this.dataservice.getRoadsByParams({}).subscribe(response=>{
      this.filterService.mapRoadsArrayAll=response.data;
    });
    this.roadTab2=[];
    this.selectionArrayRoads=[];
    this.currentStatus = true;
    this.currentStatusMapSelection = false;
    this.selectAllCheckVillages = false;
    this.selectAllCheck = false;
    this.selectAllCheckFacilities = false;
    this.roadWayRadio = 'FB';
    this.bridgeFilter = 'TF';
    this.agriculturFacilitationFilter = 'TF';
    this.tab = 0;
    this.sqlInFclass;
    this.unclassifiedCheck = '\'unclassified\'';
    this.primaryCheck = '\'primary\'';
    this.secondaryCheck = '\'secondary\'';
    this.tertiaryCheck = '\'tertiary\'';
    this.concreteFilter = '\'concrete\'';
    this.sand_or_gravelFilter = '\'sand or gravel\'';
    this.asphaltFilter = '\'asphalt\'';
    this.diakopthsDromwn = true;
    this.getProvinces();
    this.limitPage = 15;
    this.FacilitislimitPage = 16;
    this.villageLimitPage = 16;
    this.getDistrictsTab2();
  }


  public showCriteriaOrMca(){
    this.mcaActive=!this.mcaActive;
  }

  selectProvince(province) {
    this.currentProvinceCode = '';
    this.currentNum_district_code = '';
    if (this.filterService.firstInit == 0) {
      this.filterService.firstInit = 1;
      this.initMap(this.filterService,this.roadTab2);
      this.get_districts({num_province_code: province[0].num_province_code});
      if (province[0].num_province_code == 14) { //khost
        this.myMap.setView([33.3747, 69.8243], 10);
      } else {
        this.myMap.setView([33.857, 67.758], 7);
      }
      this.currentProvinceCode = province[0].num_province_code;
      this.district = [];
      if (this.tab == 2) {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode);
      } else if (this.tab == 3) {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
        this.villagesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode);
      } else {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
        this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
      }
    } else {
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        layer.closePopup();
        layer.setStyle({fillColor: 'rgba(189,72,75,1.0)'});
      });
      this.district = [];
      this.get_districts({num_province_code: province[0].num_province_code});
      if (province[0].num_province_code == 14) { //khost
        this.myMap.setView([33.3747, 69.8243], 10);
      } else {
        this.myMap.setView([33.857, 67.758], 7);
      }
      this.currentProvinceCode = province[0].num_province_code;
      if (this.tab == 2) {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode);
      } else if (this.tab == 3) {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
       this.villagesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode);
      } else {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
       this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
      }
    }
  }
  get_districts(data) {
    this.dataservice.get_districts(data).subscribe(response => {
      this.districts = response.data;
      this.districts.sort((a, b) => {
        if (a.district_name < b.district_name) {
          return -1;
        }
        if (a.district_name > b.district_name) {
          return 1;
        }
        return 0;
      });
      for (let i = 0; i < this.districts.length; i++) {
        this.districts[i].itemName = this.districts[i].district_name;
        this.districts[i].num_district_code = this.districts[i].num_district_code;
      }
    });
  }

  deselectDistrict(district) {
    this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
      layer.closePopup();
      layer.setStyle({fillColor: 'rgba(183,72,75,1.0)'});
      layer.feature.geometry.type = 'MultiPolygon';
    });
    this.myMap.setView([33.3747, 69.8243], 10);
  }

  setPageNgx($event: any) {
    this.limitPage = $event;
  }

  setPageNgxFacilities($event: any) {
    this.FacilitislimitPage = $event;
    this.facilitiesComponent.setLimit(this.FacilitislimitPage);
  }

  setPageNgxvillageLimitPage($event: any) {
    this.villageLimitPage = $event;
    this.villagesComponent.setLimit(this.villageLimitPage);
  }

  public resetFiltersFacilities() {
    this.typeFacilities = 'Both';
    this.FacilitislimitPage = 16;
    this.facilitiesComponent.setLimit(16);
    this.facilitiesComponent.resetFilters(this.typeFacilities);
  }


  public resetFiltersVillages() {
   this.villagesComponent.setLimit(16);
    this.villageLimitPage = 16;
    this.villageNameFilter = '';
    this.villagesComponent.resetFilters(this.villageNameFilter);
  }

  getRoadsByNum_district_code(num_district_code) {
    this.currentNum_district_code = num_district_code;
    this.dataservice.getRoadsByParams({'district_id': num_district_code}).subscribe(response => {
      this.roadsTab1 = response.data;
      this.roadsTab1.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      for (let i = 0; i < this.roadsTab1.length; i++) {
        if (this.roadsTab1[i].name == '') {
          this.roadsTab1[i].itemName = this.roadsTab1[i].fclass;
        } else {
          this.roadsTab1[i].itemName = this.roadsTab1[i].name;
        }
        this.roadsTab1[i].LVRR_ID = this.roadsTab1[i].LVRR_ID;
        if (this.roadsTab1[i].checked == 0) {
          this.roadsTab1[i].checked = false;
        } else {
          this.roadsTab1[i].checked = true;
        }
      }
    });
  }

  onClick(event) {
  }


  public addRoadToMap(object, event) {
    if (event.checked == true) {
      var findRoad = this.roadsTab1.find(x => x.LVRR_ID == object.LVRR_ID);
      findRoad.checked=true;
      findRoad.checkedFilter=false;
      var clone = Object.create(findRoad);
      this.roadTab2.push(clone);
    } else {
      for(var i =0;i< this.roadTab2.length;i++){
        if(this.roadTab2[i].LVRR_ID==object.LVRR_ID){
          this.roadTab2.splice(i, 1);
        }
      }
      var findRoad = this.roadsTab1.find(x => x.LVRR_ID == object.LVRR_ID);
      findRoad.checked=false;
      findRoad.checkedFilter=false;
    }
    this.myMap.setView([this.district[0].x_distance, this.district[0].y_distance], Number(this.district[0].zoom_info_district) + 1);
  }

  public hitFacilitie(facilitie){
    facilitie.checkedFilter=!facilitie.checkedFilter;
    this.markers.forEach(e=> {
      if(e.customId==facilitie.customId){
        if(facilitie.checkedFilter){
          e.openPopup();
        }else{
          e.closePopup();
        }
      }
    });
  }

  public hitVillage(village){
    village.checkedFilter=!village.checkedFilter;
    this.markers.forEach(e=> {
      if(e.villageId==village.id){
        if(village.checkedFilter){
          e.openPopup();
        }else{
          e.closePopup();
        }
      }

    });
  }


  over(road){
    var findRoad = this.roadsTab1.find(x => x.LVRR_ID == road.LVRR_ID);
    if(road.District_id==1411){ //-->spera
      this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID ===road.LVRR_ID && road.checkedFilter==true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          layer.openPopup();
        }
      });
    }else if (road.District_id==1406){  //Sand or gravel
      this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID ===road.LVRR_ID && road.checkedFilter==true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          layer.openPopup();
        }
      });

    }else if (road.District_id==1403){
      this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID ===road.LVRR_ID && road.checkedFilter==true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          layer.openPopup();
        }
      });
    }
  }

  out(road){
    var findRoad = this.roadsTab1.find(x => x.LVRR_ID == road.LVRR_ID);
    if(road.District_id==1411){ //-->spera
     this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID ===road.LVRR_ID && road.checkedFilter==true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          layer.closePopup();
        }
      });
    }else if (road.District_id==1406){  //Sand or gravel
      this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID ===road.LVRR_ID && road.checkedFilter==true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          layer.closePopup();
        }
      });
    }else if (road.District_id==1403){
      this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID ===road.LVRR_ID && road.checkedFilter==true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          layer.closePopup();
        }
      });
    }
  }

  public hitRoad(road){
    var findRoad = this.roadsTab1.find(x => x.LVRR_ID == road.LVRR_ID);
    var findRoad2 = this.roadTab2.find(x => x.LVRR_ID == road.LVRR_ID);
    if(!findRoad.checkedFilter){
      findRoad.checkedFilter=true;
      findRoad2.checkedFilter=true;
      road.checkedFilter=true;
    }else{
      findRoad.checkedFilter=false;
      findRoad2.checkedFilter=false;
      road.checkedFilter=false;
    }
    if(road.District_id==1411){ //-->spera
      this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID ===road.LVRR_ID ) {
          if(layer.feature.geometry.type === 'editMapRoad'){
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name=findRoad.name;
            layer.openPopup();
          }else if (layer.feature.geometry.type==='editMapRoadSelection'){
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }else if (road.District_id==1406){  //Nadir
      this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID ===road.LVRR_ID ) {
          if(layer.feature.geometry.type === 'editMapRoad'){
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name=findRoad.name;
            layer.openPopup();
          }else if (layer.feature.geometry.type==='editMapRoadSelection'){
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }else if (road.District_id==1403){
      this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID ===road.LVRR_ID ) {
          if(layer.feature.geometry.type === 'editMapRoad'){
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name=findRoad.name;
            layer.openPopup();
          }else if (layer.feature.geometry.type==='editMapRoadSelection'){
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
  }

  ngOnChanges2(){
    this.roadsTab1.forEach(e=>{
      e.checked=false;
      e.checkedFilter=false;
    })
    if(this.roadTab2.length>0 && this.roadsTab1.length>0){
      this.roadTab2.forEach(e=>{
        var road = this.roadsTab1.find(x => x.LVRR_ID == e.LVRR_ID);
        road.checked=true;
        road.checkedFilter=e.checkedFilter;
      });
    }
  }

  public updateFilter() { //unclassified primary secondary tertiary
    this.getRoadsPyParams();
  }


  public updateNameVillageFilter() { //unclassified primary secondary tertiary
    this.villagesComponent.updateFilters(this.villageNameFilter);
  }

  public updateFilterTabFacilities() { //unclassified primary secondary tertiary
    this.facilitiesComponent.getFiltersType(this.typeFacilities);
  }

  public selectAllCheckMethod() {
    if (this.selectAllCheck) {
      this.roadsTab1.forEach(element => {
        element.checked = false;
        this.roadTab2.splice(0,this.roadTab2.length);
        this.selectionArrayRoads.splice(0,this.selectionArrayRoads.length)
      });
    } else {
      this.roadsTab1.forEach(element => {
        // element);
        element.checked = true;
        this.roadsToMap.push(element);
        element.checkedFilter=false;
        this.roadTab2.push(element);
        this.selectionArrayRoads.push(element);

      });
    }
  }



  public removeAllMarkersFromMap() {
    this.markers.forEach(element => {
      this.myMap.removeLayer(element);
    });
  }

  public addFacilitiesToMap() {
    if (this.filterService.facilitiesArray) {
      var marker;
      this.filterService.facilitiesArray.forEach(element => {
        marker = L.marker([element.North, element.East]);
        if (element.main_type == 'distcenters') {
          var icon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          var popupContent = '<table>\
                     <tr>\
                         <td colspan="2">' + 'Center Type: ' + element.Center_Typ + '</td>\
                    </tr>\
                </table>';
          marker.bindPopup(popupContent,{ autoClose: false});
          marker.setIcon(icon);
          marker.customId=element.id+element.Type;
        } else if (element.main_type == 'schools') {
          var icon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          var popupContent = '<table>\
                     <tr>\
                         <td colspan="2">' + 'Name: ' + element.NAME + '</td>\
                    </tr>\
                     <tr>\
                         <td colspan="2">' + 'Type: ' + element.Type + '</td>\
                    </tr>\
                </table>';
          marker.bindPopup(popupContent,{ autoClose: false});
          marker.setIcon(icon);
          marker.customId=element.id+element.Type;
        } else if (element.main_type == 'mosques') {
          var icon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          var popupContent = '<table>\
                     <tr>\
                         <td colspan="2">' + 'Name: ' + element.NAME + '</td>\
                    </tr>\
                     <tr>\
                         <td colspan="2">' + 'Type: ' + element.Type + '</td>\
                    </tr>\
                </table>';
          marker.bindPopup(popupContent,{ autoClose: false});
          marker.setIcon(icon);
          marker.customId=element.id+element.Type;
        }
        marker.addTo(this.myMap);
        if (this.currentNum_district_code) {
          this.myMap.setView([this.district[0].x_distance, this.district[0].y_distance], Number(this.district[0].zoom_info_district) + 1);
        }
        this.markers.push(marker);
        if(element.checkedFilter){
          marker.openPopup();
        }
      });
    }
  }

  public addVillagesToMap() {

    if (this.filterService.villagesArray) {
      var marker;
      this.filterService.villagesArray.forEach(element => {
        marker = L.marker([element.Map_Lat, element.Map_Long]);
        var icon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        var popupContent = '<table>\
                     <tr>\
                         <td colspan="2">' + 'Name: ' + element.village_name + '</td>\
                    </tr>\
                     <tr>\
                         <td colspan="2">' + 'Population: ' + element.VillagePop + '</td>\
                    </tr>\
                </table>';
        marker.bindPopup(popupContent,{ autoClose: false});
        marker.setIcon(icon);
        marker.villageId=element.id;
        marker.addTo(this.myMap);
        this.markers.push(marker);
        if(element.checkedFilter){
          marker.openPopup();
        }
        if (this.currentNum_district_code) {
          this.myMap.setView([this.district[0].x_distance, this.district[0].y_distance], Number(this.district[0].zoom_info_district) + 1);
        }
      });
    }
  }
  public setRoadsToMap() {




    for (let i = 0; i <this.roadsTab1.length; i++) {
      var LVRR_ID = this.roadsTab1[i].LVRR_ID;
      var checked = this.roadsTab1[i].checked;



      if(this.currentNum_district_code==1411){ //-->spera


        this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID ===LVRR_ID && checked==true) {
            if(layer.feature.geometry.type == 'editMapRoadSelection'){
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            }else{
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          }else if (layer.feature.properties.LVRR_ID ===LVRR_ID && checked==false){
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
            layer.closePopup();
          }
        });

      }else if (this.currentNum_district_code==1406){  //Nadir


        this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID ===LVRR_ID && checked==true) {
            if(layer.feature.geometry.type == 'editMapRoadSelection'){
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            }else{
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          }else if (layer.feature.properties.LVRR_ID ===LVRR_ID && checked==false){
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
            layer.closePopup();
          }
        });


      }else if (this.currentNum_district_code==1403){ //gurbuz

        this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID ===LVRR_ID && checked==true) {
            if(layer.feature.geometry.type == 'editMapRoadSelection'){
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            }else{
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          }else if (layer.feature.properties.LVRR_ID ===LVRR_ID && checked==false){
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
            layer.closePopup();
          }
        });


      }



    }




  }

  public switchTab($event: MatTabChangeEvent) {
    var tab = $event.index;
    this.tab = tab;
    if (tab == 0) {

      this.ngOnChanges2();
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode); //mhn kaleseis thn get sou gia ta fereis ta facilities
      this.removeAllMarkersFromMap();
      this.setRoadsToMap();
      this.addFacilitiesToMap();
      this.addVillagesToMap();
      window.dispatchEvent(new Event('resize'));

    } else if (tab == 1) {
      this.ngOnChanges2();
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
      this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
    } else if (tab == 2) {
      this.initMapRoadsArray();
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode);
      this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
    } else if (tab == 3) {
      this.initMapRoadsArray();
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
      this.villagesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode);
    }
  }

  public initMapRoadsArray() { //
    this.filterService.mapRoadsArray.splice(0,this.selectionArrayRoads.length);
    var tempRoads = [];
    tempRoads = this.roadsTab1;
    for (let i = 0; i < tempRoads.length; i++) {
      this.filterService.mapRoadsArray.push(tempRoads[i]);
    }
  }

  updateFiterFclass(e) {
    var sqlIn = '(' + e.toString() + ')';
    this.sqlInFclass = sqlIn; ///
    this.getRoadsPyParams();
  }

  updateRoadConditionFilter(e) {
    var checks = [];
    checks = e;

    var sqlIn = '(' + e.toString() + ')';
    this.sqlInRoadConditions = sqlIn; ///
    this.getRoadsPyParams();
  }


  public selectRoad(road) {
  }

  public getRoadsPyParams() {
    this.dataservice.getRoadsByParams(
      {
        'district_id': this.currentNum_district_code,
        'nameFilter': this.nameFilter,
        'limit': this.limitPage,
        'sqlInFclass': this.sqlInFclass,
        'sqlInRoadConditions': this.sqlInRoadConditions,
        'oneway': this.roadWayRadio,
        'maxSpeedFilter': this.maxSpeedFilter,
        'bridgeFilter': this.bridgeFilter,
        'agriculturFacilitationFilter': this.agriculturFacilitationFilter
      }
    ).subscribe(response => {
      this.roadsTab1 = response.data;
      this.roadsTab1.forEach(e => {
        e.checked = false;
        e.checkedFilter = false;
      });
      this.roadTab2.forEach(e=>{  //roadTab2
        var findRoad = this.roadsTab1.find(x => x.LVRR_ID == e.LVRR_ID);
        findRoad.checked=true;
        if(e.checkedFilter){
          findRoad.checkedFilter=true;
        }else{
          findRoad.checkedFilter=false;
        }
      });
    });
  }

  public calculateCriteria(){

    this.dataservice.calculateCriteria({
      "district_id":this.currentNum_district_code
    }).subscribe(response=>{

      if(response.status=="ok"){
        this.snackBar.open(response.message, "x", <MatSnackBarConfig>{ duration: 4000 });

        this.getRoadsPyParams();

      }else{
        this.snackBar.open(response.message, "x", <MatSnackBarConfig>{ duration: 4000 });

        //"Not selected District"
      }


    })


  }




  deselectProvince(province) {
    this.districts = [];
    this.district = '';
    this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
      layer.closePopup();
      layer.setStyle({fillColor: 'rgba(183,72,75,1.0)'});
      layer.feature.geometry.type = 'MultiPolygon';
    });
    this.myMap.setView([33.857, 67.758], 7);
  }

  selectDistrict(district) {
    this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
      layer.setStyle({fillColor: 'rgba(183,72,75,1.0)'});
      layer.feature.geometry.type = 'MultiPolygon';

    });
    this.highlightOnDistrictByName(district[0]);
    this.currentNum_district_code = district[0].num_district_code;
    console.log(district);
    console.log(this.currentNum_district_code);
    this.getRoadsPyParams();
    if (this.tab == 2) {
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode);
    } else if (this.tab == 3) {
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
      this.villagesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode);
    } else {
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
      this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode);
    }
  }

  public highlightOnDistrictByName(district) {
    this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
      if (layer.feature.properties.dist_name_ == district.district_name) {
        layer.setStyle({fillColor: '#ffff00'});
        layer.openPopup();
        layer.feature.geometry.type = 'editRow';
      }
    });

    if (district.x_distance != null && district.y_distance != null) {
      this.myMap.setView([district.x_distance, district.y_distance], district.zoom_info_district);
    }
  }


  ngAfterViewInit(): void {
    this.selectionArrayRoads=[];
    this.diakopthsDromwn = true;
    this.roadsTab1=[];
    this.initGlobalMap();
  }


  public selectAllCheckMethodFacilities() {
    this.facilitiesComponent.selectAllCheckMethod(this.selectAllCheckFacilities);

  }

  public selectAllCheckMethodVillages() {
    this.villagesComponent.selectAllCheckMethod(this.selectAllCheckVillages);

  }




  private initMap(filterService,roadTab2): void {

    this.myMap.setView([33.857, 67.756], 6.5);
    var highlightLayer;



    function highlightFeature(e) {
      highlightLayer = e.target;
      if (e.target.feature.geometry.type === 'MultiLineString') {
        highlightLayer.setStyle(
          {color: '#00ff17', weight: 8}
        );
      } else if (e.target.feature.geometry.type === 'MultiPolygon') { //
        highlightLayer.setStyle({
          fillColor: '#ffff00',
          fillOpacity: 1
        });
      } else if (e.target.feature.geometry.type === 'editMapRoad') {
        highlightLayer.openPopup();
        highlightLayer.setStyle({
          color: '#00ff17',
          fillOpacity: 1
        });
      }else if (e.target.feature.geometry.type === 'editMapRoadSelection'){//editMapRoadSelection
        highlightLayer.openPopup();
        highlightLayer.setStyle({
          color: '#ff100e',
          fillOpacity: 1
        });
      }
    }




    function highlightFeatureOnClick(e) {
      if (e.target.feature.geometry.type == 'MultiLineString') {
        var findRoadForGetMethod = filterService.mapRoadsArrayAll.find(x => x.LVRR_ID == e.target.feature.properties.LVRR_ID);
        findRoadForGetMethod.checkedFilter=false;
        roadTab2.push(findRoadForGetMethod);
        e.target.feature.geometry.type = 'editMapRoad';
        highlightLayer.setStyle(
          {color: '#009111', weight: 8}
        );
      } else if (e.target.feature.geometry.type == 'editMapRoad' ) {  //editMapRoadSelection
        e.target.feature.geometry.type = 'MultiLineString';
        highlightLayer.setStyle(
          {color: '#00ff17', weight: 8}
        );
        for (var i = 0; i < roadTab2.length; i++) {
          if (roadTab2[i].LVRR_ID == e.target.feature.properties.LVRR_ID) {
            roadTab2.splice(i, 1);
          }
        }
      }
    }


    function unhighlightFeature(e) {
      if (e.target.feature.geometry.type === 'MultiLineString') {
        for (var i in e.target._eventParents) {
          e.target._eventParents[i].resetStyle(e.target);
        }
      } else if (e.target.feature.geometry.type === 'editMapRoad') {
        highlightLayer.closePopup();
        highlightLayer.setStyle(
          {color: '#009111', weight: 8}
        );
      }else if (e.target.feature.geometry.type === 'editMapRoadSelection'){
        highlightLayer.closePopup();
        highlightLayer.setStyle(
          {color: '#910002', weight: 8}
        );
      }
    }

    function unhighlightFeaturePolygon(e) {
      if (e.target.feature.geometry.type === 'MultiPolygon') {
        for (var i in e.target._eventParents) {
          e.target._eventParents[i].resetStyle(e.target);
        }
      }
    }

    this.myMap.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
    var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
    //  L.control.locate({locateOptions: {maxZoom: 19}}).addTo(this.myMap);
    var bounds_group = new L.featureGroup([]);

    function setBounds() {
    }

    this.myMap.createPane('pane_OpenStreetMap_0');
    this.myMap.getPane('pane_OpenStreetMap_0').style.zIndex = 400;
    var layer_OpenStreetMap_0 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      pane: 'pane_OpenStreetMap_0',
      opacity: 1.0,
      attribution: '',
      minZoom: 1,
      maxZoom: 28,
      minNativeZoom: 0,
      maxNativeZoom: 19
    });
    layer_OpenStreetMap_0;
    this.myMap.addLayer(layer_OpenStreetMap_0);

    function pop_KhostProvincedistrictsKhost_Province_UTM42n_1(feature, layer) {
      layer.on({
        mouseout: unhighlightFeaturePolygon,
        mouseover: highlightFeature,
      });
      var popupContent = '<table>\
                     <tr>\
                         <td colspan="2">' + (feature.properties['dist_name_'] !== null ? autolinker.link(feature.properties['dist_name_'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_KhostProvincedistrictsKhost_Province_UTM42n_1_0() {
      return {
        pane: 'pane_KhostProvincedistrictsKhost_Province_UTM42n_1',
        opacity: 1,
        color: 'rgba(35,35,35,1.0)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 1.0,
        fill: true,
        fillOpacity: 1,
        fillColor: 'rgba(183,72,75,1.0)',
        interactive: true,
      };
    }

    this.myMap.createPane('pane_KhostProvincedistrictsKhost_Province_UTM42n_1');
    this.myMap.getPane('pane_KhostProvincedistrictsKhost_Province_UTM42n_1').style.zIndex = 401;
    this.myMap.getPane('pane_KhostProvincedistrictsKhost_Province_UTM42n_1').style['mix-blend-mode'] = 'normal';
    var layer_KhostProvincedistrictsKhost_Province_UTM42n_1 = new L.geoJson(json_KhostProvincedistrictsKhost_Province_UTM42n_1, {  //
      attribution: '',
      interactive: true,
      dataVar: 'json_KhostProvincedistrictsKhost_Province_UTM42n_1',
      layerName: 'layer_KhostProvincedistrictsKhost_Province_UTM42n_1',
      pane: 'pane_KhostProvincedistrictsKhost_Province_UTM42n_1',
      onEachFeature: pop_KhostProvincedistrictsKhost_Province_UTM42n_1,
      style: style_KhostProvincedistrictsKhost_Province_UTM42n_1_0,
    });
    this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1 = layer_KhostProvincedistrictsKhost_Province_UTM42n_1;
    bounds_group.addLayer(layer_KhostProvincedistrictsKhost_Province_UTM42n_1);
    this.myMap.addLayer(layer_KhostProvincedistrictsKhost_Province_UTM42n_1);

    function pop_Khost_Province_Baak_District_OSM_roads_UTM42n_2(feature, layer) {
      layer.on({
        mouseout: function (e) {
          for (let i in e.target._eventParents) {
            e.target._eventParents[i].resetStyle(e.target);
          }
        },
        mouseover: highlightFeature,
      });
      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>District</strong><br />' + (feature.properties['District'] !== null ? autolinker.link(feature.properties['District'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Baak_District_OSM_roads_UTM42n_2_0() {
      return {
        pane: 'pane_Khost_Province_Baak_District_OSM_roads_UTM42n_2',
        opacity: 1,
        color: 'rgba(255,158,23,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Baak_District_OSM_roads_UTM42n_2');
    this.myMap.getPane('pane_Khost_Province_Baak_District_OSM_roads_UTM42n_2').style.zIndex = 402;
    this.myMap.getPane('pane_Khost_Province_Baak_District_OSM_roads_UTM42n_2').style['mix-blend-mode'] = 'normal';
    var layer_Khost_Province_Baak_District_OSM_roads_UTM42n_2 = new L.geoJson(json_Khost_Province_Baak_District_OSM_roads_UTM42n_2, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Baak_District_OSM_roads_UTM42n_2',
      layerName: 'layer_Khost_Province_Baak_District_OSM_roads_UTM42n_2',
      pane: 'pane_Khost_Province_Baak_District_OSM_roads_UTM42n_2',
      onEachFeature: pop_Khost_Province_Baak_District_OSM_roads_UTM42n_2,
      style: style_Khost_Province_Baak_District_OSM_roads_UTM42n_2_0,
    });
    bounds_group.addLayer(layer_Khost_Province_Baak_District_OSM_roads_UTM42n_2);
    this.myMap.addLayer(layer_Khost_Province_Baak_District_OSM_roads_UTM42n_2);

    function pop_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click   : highlightFeatureOnClick
      });
      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                       <tr>\
                        <td colspan="2"><strong>LVRR_ID</strong><br />' + (feature.properties['LVRR_ID'] !== null ? autolinker.link(feature.properties['LVRR_ID'].toLocaleString()) : '') + '</td>\
                    </tr>\<tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\<tr>\
                        <td colspan="2"><strong>Road Condition</strong><br />' + (feature.properties['surface'] !== null ? autolinker.link(feature.properties['surface'].toLocaleString()) : '') + '</td>\
                    </tr>\<tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: false});
    }

    function style_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3_0() {
      return {
        pane: 'pane_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3',
        opacity: 1,
        color: 'rgba(232,113,141,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3');
    this.myMap.getPane('pane_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3').style.zIndex = 403;
    this.myMap.getPane('pane_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3').style['mix-blend-mode'] = 'normal';
    this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3 = new L.geoJson(json_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3',
      layerName: 'layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3',
      pane: 'pane_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3',
      onEachFeature: pop_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3,
      style: style_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3);
    this.myMap.addLayer(this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3);

    function pop_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4(feature, layer) {
      layer.on({
        mouseout: function (e) {
          for (let i in e.target._eventParents) {
            e.target._eventParents[i].resetStyle(e.target);
          }
        },
        mouseover: highlightFeature,
      });
      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>District</strong><br />' + (feature.properties['District'] !== null ? autolinker.link(feature.properties['District'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4_0() {
      return {
        pane: 'pane_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4',
        opacity: 1,
        color: 'rgba(141,90,153,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4');
    this.myMap.getPane('pane_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4').style.zIndex = 404;
    this.myMap.getPane('pane_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4').style['mix-blend-mode'] = 'normal';
    var layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4 = new L.geoJson(json_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4',
      layerName: 'layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4',
      pane: 'pane_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4',
      onEachFeature: pop_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4,
      style: style_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4_0,
    });
    bounds_group.addLayer(layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4);
    this.myMap.addLayer(layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4);

    function pop_Khost_Province_Khost_District_OSM_roads_UTM42n_5(feature, layer) {
      layer.on({
        mouseout: function (e) {
          for (let i in e.target._eventParents) {
            e.target._eventParents[i].resetStyle(e.target);
          }
        },
        mouseover: highlightFeature,
      });
      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>District</strong><br />' + (feature.properties['District'] !== null ? autolinker.link(feature.properties['District'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Khost_District_OSM_roads_UTM42n_5_0() {
      return {
        pane: 'pane_Khost_Province_Khost_District_OSM_roads_UTM42n_5',
        opacity: 1,
        color: 'rgba(243,166,178,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Khost_District_OSM_roads_UTM42n_5');
    this.myMap.getPane('pane_Khost_Province_Khost_District_OSM_roads_UTM42n_5').style.zIndex = 405;
    this.myMap.getPane('pane_Khost_Province_Khost_District_OSM_roads_UTM42n_5').style['mix-blend-mode'] = 'normal';
    var layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5 = new L.geoJson(json_Khost_Province_Khost_District_OSM_roads_UTM42n_5, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Khost_District_OSM_roads_UTM42n_5',
      layerName: 'layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5',
      pane: 'pane_Khost_Province_Khost_District_OSM_roads_UTM42n_5',
      onEachFeature: pop_Khost_Province_Khost_District_OSM_roads_UTM42n_5,
      style: style_Khost_Province_Khost_District_OSM_roads_UTM42n_5_0,
    });
    bounds_group.addLayer(layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5);
    this.myMap.addLayer(layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5);

    function pop_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6(feature, layer) {
      layer.on({
        mouseout: function (e) {
          for (let i in e.target._eventParents) {
            e.target._eventParents[i].resetStyle(e.target);
          }
        },
        mouseover: highlightFeature,
      });
      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>District</strong><br />' + (feature.properties['District'] !== null ? autolinker.link(feature.properties['District'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6_0() {
      return {
        pane: 'pane_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6',
        opacity: 1,
        color: 'rgba(114,155,111,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6');
    this.myMap.getPane('pane_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6').style.zIndex = 406;
    this.myMap.getPane('pane_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6').style['mix-blend-mode'] = 'normal';
    var layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6 = new L.geoJson(json_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6',
      layerName: 'layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6',
      pane: 'pane_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6',
      onEachFeature: pop_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6,
      style: style_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6_0,
    });
    bounds_group.addLayer(layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6);
    this.myMap.addLayer(layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6);

    function pop_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7(feature, layer) {
      layer.on({
        mouseout: function (e) {
          for (let i in e.target._eventParents) {
            e.target._eventParents[i].resetStyle(e.target);
          }
        },
        mouseover: highlightFeature,
      });
      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>District</strong><br />' + (feature.properties['District'] !== null ? autolinker.link(feature.properties['District'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7_0() {
      return {
        pane: 'pane_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7',
        opacity: 1,
        color: 'rgba(213,180,60,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7');
    this.myMap.getPane('pane_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7').style.zIndex = 407;
    this.myMap.getPane('pane_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7').style['mix-blend-mode'] = 'normal';
    var layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7 = new L.geoJson(json_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7',
      layerName: 'layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7',
      pane: 'pane_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7',
      onEachFeature: pop_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7,
      style: style_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7_0,
    });
    bounds_group.addLayer(layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7);
    this.myMap.addLayer(layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7);

    function pop_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8(feature, layer) {

      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click   : highlightFeatureOnClick
      });


      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>District</strong><br />' + (feature.properties['District'] !== null ? autolinker.link(feature.properties['District'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8_0() {
      return {
        pane: 'pane_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8',
        opacity: 1,
        color: 'rgba(164,113,88,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8');
    this.myMap.getPane('pane_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8').style.zIndex = 408;
    this.myMap.getPane('pane_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8').style['mix-blend-mode'] = 'normal';
    this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8 = new L.geoJson(json_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8',
      layerName: 'layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8',
      pane: 'pane_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8',
      onEachFeature: pop_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8,
      style: style_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8);
    this.myMap.addLayer(this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8);

    function pop_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9(feature, layer) {
      layer.on({
        mouseout: function (e) {
          for (let i in e.target._eventParents) {
            e.target._eventParents[i].resetStyle(e.target);
          }
        },
        mouseover: highlightFeature,
      });
      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>District</strong><br />' + (feature.properties['District'] !== null ? autolinker.link(feature.properties['District'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9_0() {
      return {
        pane: 'pane_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9',
        opacity: 1,
        color: 'rgba(133,182,111,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9');
    this.myMap.getPane('pane_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9').style.zIndex = 409;
    this.myMap.getPane('pane_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9').style['mix-blend-mode'] = 'normal';
    var layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9 = new L.geoJson(json_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9',
      layerName: 'layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9',
      pane: 'pane_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9',
      onEachFeature: pop_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9,
      style: style_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9_0,
    });
    bounds_group.addLayer(layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9);
    this.myMap.addLayer(layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9);

    function pop_Khost_Province_Sabari_District_OSM_roads_UTM42n_10(feature, layer) {
      layer.on({
        mouseout: function (e) {
          for (let i in e.target._eventParents) {
            e.target._eventParents[i].resetStyle(e.target);
          }
        },
        mouseover: highlightFeature,
      });
      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>District</strong><br />' + (feature.properties['District'] !== null ? autolinker.link(feature.properties['District'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Sabari_District_OSM_roads_UTM42n_10_0() {
      return {
        pane: 'pane_Khost_Province_Sabari_District_OSM_roads_UTM42n_10',
        opacity: 1,
        color: 'rgba(125,139,143,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Sabari_District_OSM_roads_UTM42n_10');
    this.myMap.getPane('pane_Khost_Province_Sabari_District_OSM_roads_UTM42n_10').style.zIndex = 410;
    this.myMap.getPane('pane_Khost_Province_Sabari_District_OSM_roads_UTM42n_10').style['mix-blend-mode'] = 'normal';
    var layer_Khost_Province_Sabari_District_OSM_roads_UTM42n_10 = new L.geoJson(json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10',
      layerName: 'layer_Khost_Province_Sabari_District_OSM_roads_UTM42n_10',
      pane: 'pane_Khost_Province_Sabari_District_OSM_roads_UTM42n_10',
      onEachFeature: pop_Khost_Province_Sabari_District_OSM_roads_UTM42n_10,
      style: style_Khost_Province_Sabari_District_OSM_roads_UTM42n_10_0,
    });
    bounds_group.addLayer(layer_Khost_Province_Sabari_District_OSM_roads_UTM42n_10);
    this.myMap.addLayer(layer_Khost_Province_Sabari_District_OSM_roads_UTM42n_10);

    function pop_Khost_Province_Shamul_District_OSM_roads_UTM42n_11(feature, layer) {
      layer.on({
        mouseout: function (e) {
          for (let i in e.target._eventParents) {
            e.target._eventParents[i].resetStyle(e.target);
          }
        },
        mouseover: highlightFeature,
      });
      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>District</strong><br />' + (feature.properties['District'] !== null ? autolinker.link(feature.properties['District'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Shamul_District_OSM_roads_UTM42n_11_0() {
      return {
        pane: 'pane_Khost_Province_Shamul_District_OSM_roads_UTM42n_11',
        opacity: 1,
        color: 'rgba(145,82,45,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Shamul_District_OSM_roads_UTM42n_11');
    this.myMap.getPane('pane_Khost_Province_Shamul_District_OSM_roads_UTM42n_11').style.zIndex = 411;
    this.myMap.getPane('pane_Khost_Province_Shamul_District_OSM_roads_UTM42n_11').style['mix-blend-mode'] = 'normal';
    var layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11 = new L.geoJson(json_Khost_Province_Shamul_District_OSM_roads_UTM42n_11, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Shamul_District_OSM_roads_UTM42n_11',
      layerName: 'layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11',
      pane: 'pane_Khost_Province_Shamul_District_OSM_roads_UTM42n_11',
      onEachFeature: pop_Khost_Province_Shamul_District_OSM_roads_UTM42n_11,
      style: style_Khost_Province_Shamul_District_OSM_roads_UTM42n_11_0,
    });
    bounds_group.addLayer(layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11);
    this.myMap.addLayer(layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11);

    function pop_Khost_Province_Spera_District_OSM_roads_UTM42n_12(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click   : highlightFeatureOnClick
      });

      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2"><strong>osm_id</strong><br />' + (feature.properties['osm_id'] !== null ? autolinker.link(feature.properties['osm_id'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>code</strong><br />' + (feature.properties['code'] !== null ? autolinker.link(feature.properties['code'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>fclass</strong><br />' + (feature.properties['fclass'] !== null ? autolinker.link(feature.properties['fclass'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>name</strong><br />' + (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>ref</strong><br />' + (feature.properties['ref'] !== null ? autolinker.link(feature.properties['ref'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>oneway</strong><br />' + (feature.properties['oneway'] !== null ? autolinker.link(feature.properties['oneway'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>maxspeed</strong><br />' + (feature.properties['maxspeed'] !== null ? autolinker.link(feature.properties['maxspeed'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>layer</strong><br />' + (feature.properties['layer'] !== null ? autolinker.link(feature.properties['layer'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>bridge</strong><br />' + (feature.properties['bridge'] !== null ? autolinker.link(feature.properties['bridge'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>tunnel</strong><br />' + (feature.properties['tunnel'] !== null ? autolinker.link(feature.properties['tunnel'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2"><strong>District</strong><br />' + (feature.properties['District'] !== null ? autolinker.link(feature.properties['District'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Spera_District_OSM_roads_UTM42n_12_0() {
      return {
        pane: 'pane_Khost_Province_Spera_District_OSM_roads_UTM42n_12',
        opacity: 1,
        color: 'rgba(190,178,151,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }



    this.myMap.createPane('pane_Khost_Province_Spera_District_OSM_roads_UTM42n_12');
    this.myMap.getPane('pane_Khost_Province_Spera_District_OSM_roads_UTM42n_12').style.zIndex = 412;
    this.myMap.getPane('pane_Khost_Province_Spera_District_OSM_roads_UTM42n_12').style['mix-blend-mode'] = 'normal';
    this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3 = new L.geoJson(json_Khost_Province_Spera_District_OSM_roads_UTM42n_12, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Spera_District_OSM_roads_UTM42n_12',
      layerName: 'layer_Khost_Province_Spera_District_OSM_roads_UTM42n_12',
      pane: 'pane_Khost_Province_Spera_District_OSM_roads_UTM42n_12',
      onEachFeature: pop_Khost_Province_Spera_District_OSM_roads_UTM42n_12,
      style: style_Khost_Province_Spera_District_OSM_roads_UTM42n_12_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3);
    this.myMap.addLayer(this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3);

    function pop_Khost_Province_Tanay_District_OSM_roads_UTM42n_13(feature, layer) {
      layer.on({
        mouseout: function (e) {
          for (let i in e.target._eventParents) {
            e.target._eventParents[i].resetStyle(e.target);
          }
        },
        mouseover: highlightFeature,
      });
      var popupContent = (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '');

      layer.bindPopup(popupContent, {maxHeight: 400});
    }

    function style_Khost_Province_Tanay_District_OSM_roads_UTM42n_13_0() {
      return {
        pane: 'pane_Khost_Province_Tanay_District_OSM_roads_UTM42n_13',
        opacity: 1,
        color: 'rgba(196,60,57,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Tanay_District_OSM_roads_UTM42n_13');
    this.myMap.getPane('pane_Khost_Province_Tanay_District_OSM_roads_UTM42n_13').style.zIndex = 413;
    this.myMap.getPane('pane_Khost_Province_Tanay_District_OSM_roads_UTM42n_13').style['mix-blend-mode'] = 'normal';
    var layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13 = new L.geoJson(json_Khost_Province_Tanay_District_OSM_roads_UTM42n_13, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Tanay_District_OSM_roads_UTM42n_13',
      layerName: 'layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13',
      pane: 'pane_Khost_Province_Tanay_District_OSM_roads_UTM42n_13',
      onEachFeature: pop_Khost_Province_Tanay_District_OSM_roads_UTM42n_13,
      style: style_Khost_Province_Tanay_District_OSM_roads_UTM42n_13_0,
    });
    bounds_group.addLayer(layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13);
    this.myMap.addLayer(layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13);

    function pop_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14(feature, layer) {
      layer.on({
        mouseout: function (e) {
          for (let i in e.target._eventParents) {
            e.target._eventParents[i].resetStyle(e.target);
          }
        },
        mouseover: highlightFeature
      });
      var popupContent = (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '');
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: false});
    }

    function style_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14_0() {
      return {
        pane: 'pane_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14',
        opacity: 1,
        color: 'rgba(229,182,54,1.0)',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14');
    this.myMap.getPane('pane_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14').style.zIndex = 414;
    this.myMap.getPane('pane_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14').style['mix-blend-mode'] = 'normal';
    this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14 = new L.geoJson(json_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14',
      layerName: 'layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14',
      pane: 'pane_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14',
      onEachFeature: pop_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14,
      style: style_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14);
    this.myMap.addLayer(this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14);
    setBounds();
  }

  public setMapArray(teampRoads: any[]) {
    //$(container).scrollTo(target)

  }




  scrollToId(id: string) {
    console.log("element id : ", id);
    this.scrollService.scrollToElementById(id);
  }


  public openClosedSideNav() {
    this.drawer.toggle().finally(()=>{
      window.dispatchEvent(new Event('resize'));
    });
    this.currentStatus = !this.currentStatus;
  }

  public openClosedSideNavMapSelections() {
    this.drawerMapSelections.toggle().finally(()=>{
      window.dispatchEvent(new Event('resize'));

    });

    this.currentStatusMapSelection = !this.currentStatusMapSelection;
  }
  getProvinces() {
    this.dataservice.get_province().subscribe(response => {
      this.provinces = response.data;
      this.provinces.sort((a, b) => {
        if (a.province_name < b.province_name) {
          return -1;
        }
        if (a.province_name > b.province_name) {
          return 1;
        }
        return 0;
      });
      for (let i = 0; i < this.provinces.length; i++) {
        this.provinces[i].itemName = this.provinces[i].province_name;
        this.provinces[i].num_province_code = this.provinces[i].num_province_code;
      }
    });
  }

  private getDistrictsTab2() {
    this.dataservice.get_districts({}).subscribe(response => {
      this.districtsTabRoads = response.data;
      this.districtsTabRoads.sort((a, b) => {
        if (a.district_name < b.district_name) {
          return -1;
        }
        if (a.district_name > b.district_name) {
          return 1;
        }
        return 0;
      });
      for (let i = 0; i < this.districtsTabRoads.length; i++) {
        this.districtsTabRoads[i].itemName = this.districtsTabRoads[i].district_name;
        this.districtsTabRoads[i].num_district_code = this.districtsTabRoads[i].num_district_code;
      }
    });
  }


  private initGlobalMap() {

    this.myMap = L.map('map', {
      zoomControl: true, maxZoom: 28, minZoom: 1
    }).fitBounds([[29.75680629128297, 57.077598100580225], [38.867198097612054, 77.19307423730505]]);
    this.myMap.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
    function setBounds() {
    }
    this.myMap.createPane('pane_OpenStreetMap_0');
    this.myMap.getPane('pane_OpenStreetMap_0').style.zIndex = 400;
    var layer_OpenStreetMap_0 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        pane: 'pane_OpenStreetMap_0',
        opacity: 1.0,
        attribution: '',
        minZoom: 1,
        fullscreenControl: true,
        fullscreenControlOptions: {
          position: 'topleft'
        },
        maxZoom: 28,
        minNativeZoom: 0,
        maxNativeZoom: 19
      }


    );



    this.myMap.addLayer(layer_OpenStreetMap_0);
    setBounds();


  }


  editRoad(item): void {
    const dialogRef = this.dialog.open(EditRoadDialog, {
      width: '510px',
      height: '495px',
      data: item
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     result.leadId = this.id;
    //     this.dataService.updateTimelineNode(result).subscribe(response => {
    //       if (response.status == 'ok') {
    //         this.snackBar.open(
    //           response.message,
    //           'x',
    //           <MatSnackBarConfig>{duration: 3000}
    //         );
    //         this.dataService.getAllLeads({id: this.id}).subscribe(response => {
    //           this.items = response.data[0].timeLineList;
    //         });
    //       } else {
    //         this.snackBar.open(
    //           response.message,
    //           'x',
    //           <MatSnackBarConfig>{duration: 3000}
    //         );
    //       }
    //     });
    //   }
    // });
  }
}



@Component({
  selector: './edit-road-dialog',
  templateUrl: './edit-road-dialog.html'
})
export class EditRoadDialog implements OnInit {
  // editForm: FormGroup;
  // title;
  // choosenDate = moment(new Date()).isValid() ? moment(new Date()).format('YYYY-MM-DD') : '';
  // description;
  // organator;
  constructor(    public dialogRef: MatDialogRef<EditRoadDialog>,

                  // private formBuilder2: FormBuilder,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    // public dialogRef: MatDialogRef<AddNewNodeTimeline>,
    // private dataService: DataService
  ) {
  }

  ngOnInit() {

  }


  onSubmit() {

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  ok(): void {
    this.dialogRef.close(true);
  }
}
