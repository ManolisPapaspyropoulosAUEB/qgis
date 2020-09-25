import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject, OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ValidationService} from '../../services/validation.service';
import {Subscription} from 'rxjs';
import * as $ from 'jquery';
import * as L from 'leaflet';
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
import { VillagesComponent} from '../villages/villages.component';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MatDrawer} from '@angular/material/sidenav';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ScrollService} from '../../services/scroll.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ExcelPdfExporterService} from '../services/excel-pdf-exporter.service';
import {CoreDataComponent} from '../core-data/core-data.component';
import {Router} from '@angular/router';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {RemoteDataService} from '../../services/remotedata.service';
import {NotesDialog, PhotoGallery, RoadsComponent} from '../roads/roads.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-qgis-map',
  templateUrl: './index.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./index.component.scss']
})
export class QgisMapComponent implements OnInit, AfterViewInit,OnDestroy  {
  title = 'Look jQuery Animation working in action!';
  public myMap ;
  public roads = [];
  public roadsTab1 = [];
  public mcaActive;
  public role;
  public rowHeight = 50;
  public currentBtnNavInit;
  public currentBtnNavCriteria;
  public currentBtnNavScores;
  public currentBtnNavMcaCbi;
  public currentBtnNav = '';
  public searchTextRoads: '';
  public searchTextFacilities: '';
  public searchTextVillages: '';
  public roadsToMap = [];
  public selectAllCheck;
  public showAllCheckRoads;
  public districtChange;
  public showAllCheckVillages;
  public orderCol;
  public descAsc;
  public flagMap;
  public selectAllCheckFacilities;
  public showAllCheckFacilities;
  public showOnMapWidth;
  public roadWayRadio;
  public typeFacilities = this.filterService.facilitiesType;
  public villageNameFilter = this.filterService.villageNameFilter;
  public limitPage;
  public shmaSort;
  public FacilitislimitPage = this.filterService.facilitiesLimitTab;
  public villageLimitPage = this.filterService.villageLimitTab;
  province: any = '';
  district: any = '';
  distId;
  road: any = '';
  nameFilterFacilitie;
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
  public coreDataLabelFilter = '';
  public selectedValuesFclass = [];
  public selectedValuesRoadCondition = [];
  public agriculturFacilitationFilter = '';
  public markers = [];
  public diakopthsDromwn = true;
  public currentLastParam = '';
  public loadingMap;
  public currentNum_district_code: any;
  public currentProvinceCode: any;
  public currentProvinceName;
  public currentDistrictName;
  public fullName;
  public email;
  private sqlInFclass;
  private sqlInRoadConditions;
  public loading;
  public tab;
  public currentStatus;
  public currentStatusMapSelection;
  public selectAllCheckVillages;
  public selectionArrayRoads;
  public layer_KhostProvincedistrictsKhost_Province_UTM42n_1;
  public layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3; //
  public layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3;
  private layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14: L.geoJson;
  public layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8: L.geoJson;
  public layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9: L.geoJson;
  public layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6: L.geoJson;
  public layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11: L.geoJson;
  public json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10: L.geoJson;
  public layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4: L.geoJson;
  public layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13: L.geoJson;
  public layer_Khost_Province_Baak_District_OSM_roads_UTM42n_2: L.geoJson;
  public layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5: L.geoJson;
  public layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7: L.geoJson;
  public layer_Districts_422_AGCHO2018_UTM42n_1: L.geoJson;
  public json_Districts_422_AGCHO2018_UTM42n_1
  private changeModeArray=[];
  public geoSub: Subscription;
  constructor(private  dataservice: DataService,
              domSanitizer: DomSanitizer,
              public router: Router,
              public remoteDataService :RemoteDataService,
              public filterService: FilterService,
              private snackBar: MatSnackBar,
              private http: HttpClient,
              public dialog: MatDialog,
              private scrollService: ScrollService,
              public excelPdfExporterService: ExcelPdfExporterService
  ) {
  }
  @ViewChild('mydatatable') mydatatable: DatatableComponent;
  @ViewChild('fclassSelect') fclassSelect;
  @ViewChild('roadConditionSelect') roadConditionSelect;
  @ViewChild(FacilitiesComponent) facilitiesComponent: FacilitiesComponent;
  @ViewChild(RoadsComponent) roadsComponent: RoadsComponent;
  @ViewChild(VillagesComponent) villagesComponent: VillagesComponent;
  @ViewChild(CoreDataComponent) coreDataComponent: CoreDataComponent;
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('drawerMapSelections') drawerMapSelections: MatDrawer;
  @ViewChild('lvrrid') lvrrid;
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

    this.roadsComponent.roadWayRadio = 'FB';
    this.roadsComponent.bridgeFilter = 'TF';
    this.roadsComponent.agriculturFacilitationFilter = 'TF';
    this.roadsComponent.nameFilter = '';
    this.roadsComponent.maxSpeedFilter = '';
    this.roadsComponent.sqlInFclass = '()';
    this.roadsComponent.sqlInRoadConditions = '()';

    this.roadsComponent.getRoadsPyParams();
  }
  public ngOnInit() {
    this.showAllCheckVillages=false;
    this.districtChange=true;
    this.showAllCheckRoads=false;
    this.role=localStorage.getItem("role");
    this.loadingMap=false;
    this.loading = false;
    this.orderCol = 'LVRR_ID';
    this.descAsc = 'asc';
    this.shmaSort = 0;
    this.filterService.tab = 0;
    this.currentBtnNav = 'init';
    this.fullName = localStorage.getItem('fullName');
    this.email = localStorage.getItem('email');
    if ((localStorage.getItem('province') != null) && (localStorage.getItem('district') != null)) {
      this.currentProvinceCode = localStorage.getItem('proCode');
      this.currentNum_district_code = localStorage.getItem('distCode');
      this.roadsComponent.currentNum_district_code=this.currentNum_district_code;
      this.roadsComponent.currentNum_district_code=this.currentNum_district_code;
      this.roadsComponent.getRoadsPyParams();//

    } else if (localStorage.getItem('province') != null) {
      this.currentProvinceCode = localStorage.getItem('proCode');
      this.roadsComponent.currentNum_district_code=this.currentNum_district_code;
      this.roadsComponent.currentNum_district_code=this.currentNum_district_code;
      this.roadsComponent.getRoadsPyParams();//
    }
    this.flagMap = false;
    this.showOnMapWidth = 100;
    this.mcaActive = true;
    this.rowHeight = 50;
    this.roadTab2 = [];
    this.selectionArrayRoads = [];
    this.currentStatus = true;
    this.currentStatusMapSelection = false;
    this.selectAllCheckVillages = false;
    this.selectAllCheck = false;
    this.selectAllCheckFacilities = false;
    this.showAllCheckFacilities = false;
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
    this.currentLastParam = '';
    this.currentBtnNavInit = true;
    this.currentBtnNavCriteria = false;
    this.currentBtnNavScores = false;
    this.currentBtnNavMcaCbi = false;
  }
  ngOnDestroy() {
  }
  reloadAndCleanLs() {
    localStorage.setItem('provinceItemName', null);
    localStorage.setItem('num_province_code', null);
    localStorage.setItem('districtItemName', null);
    localStorage.setItem('num_district_code', null);
    window.location.reload();
  }
  scrollToId(param: string) {//
    this.currentLastParam = param;
    if (param == 'init') {
      this.currentBtnNavInit = true;
      this.currentBtnNavScores = false;
      this.currentBtnNavCriteria = false;
      this.currentBtnNavMcaCbi = false;
    } else if (param == 'criteria') {
      this.currentBtnNavInit = false;
      this.currentBtnNavScores = false;
      this.currentBtnNavCriteria = true;
      this.currentBtnNavMcaCbi = false;
    } else if (param == 'c1_location') {
      this.currentBtnNavInit = false;
      this.currentBtnNavScores = true;
      this.currentBtnNavCriteria = false;
      this.currentBtnNavMcaCbi = false;
    } else if (param == 'mciCbiRates') {
      this.currentBtnNavInit = false;
      this.currentBtnNavScores = false;
      this.currentBtnNavCriteria = false;
      this.currentBtnNavMcaCbi = true;
    }
    this.scrollService.scrollToElementById(param); //
  }
  logOut() {
    localStorage.removeItem('id');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.setItem('provinceItemName', null);
    localStorage.setItem('num_province_code', null);
    localStorage.setItem('districtItemName', null);
    localStorage.setItem('num_district_code', null);
    window.location.reload();
    this.router.navigate(['/loader']);
  }
  selectProvince(province, param) {
    if (param == 'manual') {
      localStorage.setItem('provinceItemName', province[0].itemName);
      localStorage.setItem('num_province_code', province[0].num_province_code);
      localStorage.setItem('districtItemName', null);
      localStorage.setItem('num_district_code', null);
    }
    this.currentProvinceCode = '';
    this.currentNum_district_code = '';
    this.orderCol = 'LVRR_ID';
    this.descAsc = 'asc';
    this.roadTab2 = [];
    this.roadsTab1 = [];
    if (this.filterService.firstInit == 0) {
      this.filterService.firstInit = 1;
      this.initMap(this.filterService, this.filterService.roadTab2, this.drawerMapSelections, this.currentStatusMapSelection);
      this.get_districts({num_province_code: province[0].num_province_code});
      if (province[0].num_province_code == 14) { //khost
        this.myMap.setView([33.3747, 69.8243], 10);
      } else {
        this.myMap.setView([33.857, 67.758], 7);
      }
      this.currentProvinceCode = province[0].num_province_code;
      this.currentProvinceName = province[0].province_name;
      this.district = [];
      if (this.tab == 2) {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      } else if (this.tab == 3) {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
        this.villagesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      } else {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
        this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      }
    } else {
      this.currentProvinceCode = province[0].num_province_code;
      this.currentProvinceName = province[0].province_name;
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        layer.closePopup();
        if (layer.feature.properties.dist_name_ == 'Jaji Maidan') {
          layer.setStyle({fillColor: 'rgba(190,213,122,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Baak'){
          layer.setStyle({fillColor: 'rgba(188,200,128,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Sabari'){
          layer.setStyle({fillColor: 'rgba(178,208,182,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Musa Khel'){
          layer.setStyle({fillColor: 'rgba(224,181,128,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Qalandar'){
          layer.setStyle({fillColor: 'rgba(168,213,148,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Nadir Shah Kot'){
          layer.setStyle({fillColor: 'rgba(185,162,188,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Shamul'){
          layer.setStyle({fillColor: 'rgba(218,153,183,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Tanay'){
          layer.setStyle({fillColor: 'rgba(222,211,121,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Gurbuz'){
          layer.setStyle({fillColor: 'rgba(166,199,154,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Khost'){
          layer.setStyle({fillColor: 'rgba(218,160,146,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Manduzay'){
          layer.setStyle({fillColor: 'rgba(225,153,128,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Tirzayee'){
          layer.setStyle({fillColor: 'rgba(170,179,176,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Spera'){
          layer.setStyle({fillColor: 'rgba(220,150,158,1.0)'});
        }
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
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      } else if (this.tab == 3) {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
        this.villagesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      } else {
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
        this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
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

  public hitFacilitie(facilitie) {
    facilitie.checkedFilter = !facilitie.checkedFilter;
    this.markers.forEach(e => {
      if (e.customId == (facilitie.id + facilitie.type)) {
        if (facilitie.checkedFilter) {
          e.openPopup();
        } else {
          e.closePopup();
        }
      }
    });
  }
  public hitVillage(village) {
    village.checkedFilter = !village.checkedFilter;
    this.markers.forEach(e => {
      if (e.villageId == village.id) {
        if (village.checkedFilter) {
          e.openPopup();
        } else {
          e.closePopup();
        }
      }
    });
  }
  over(road) {
    var findRoad =  this.filterService.mapRoadsArrayAll.find(x => x.LVRR_ID == road.LVRR_ID);//
    if (road.districtId == 1411) { //-->spera
      this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          //layer.openPopup();
        }
      });
    } else if (road.districtId == 1406) {  //Sand or gravel
      this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          // layer.openPopup();
        }
      });

    } else if (road.districtId == 1403) {
      this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          // layer.openPopup();
        }
      });

    }
    else if (road.districtId == 1410) {
      this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          // layer.openPopup();
        }
      });
    }
    else if (road.districtId == 1402) {
      this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          // layer.openPopup();
        }
      });
    }
    else if (road.districtId == 1407) {
      this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          // layer.openPopup();
        }
      });
    }
    else if (road.districtId == 1413) {
      this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          // layer.openPopup();
        }
      });
    }
    else if (road.districtId == 1404) {
      this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          // layer.openPopup();
        }
      });
    } else if (road.districtId == 1408) {
      this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          // layer.openPopup();
        }
      });
    } else if (road.districtId == 1401) {
      this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          // layer.openPopup();
        }
      });
    } else if (road.districtId == 1405) {
      this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#ff100e', weight: 8});  //color:'#ffff00'
          // layer.openPopup();
        }
      });
    }
  }
  out(road) {
    var findRoad =  this.filterService.mapRoadsArrayAll.find(x => x.LVRR_ID == road.LVRR_ID);//
    if (road.districtId == 1411) { //-->spera
      this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //  layer.closePopup();
        }
      });
    } else if (road.districtId == 1406) {  //Sand or gravel
      this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
    else if (road.districtId == 1403) {
      this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
    else if (road.districtId == 1410) {
      this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
    else if (road.districtId == 1402) { //ok
      this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
    else if (road.districtId == 1412) { //ok
      this.layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
    else if (road.districtId == 1407) {
      this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
    else if (road.districtId == 1413) {
      this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
    else if (road.districtId == 1404) {
      this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
    else if (road.districtId == 1408) {
      this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
    else if (road.districtId == 1401) {
      this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
    else if (road.districtId == 1405) {
      this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID && road.checkedFilter == true) {
          layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
          //   layer.closePopup();
        }
      });
    }
  }
  public hitRoad(road) {
    var findRoad = this.roadsComponent.roadsTab1.find(x => x.LVRR_ID == road.LVRR_ID);
    var findRoad2 = this.filterService.roadTab2.find(x => x.LVRR_ID == road.LVRR_ID);
    var findRoadForGetMethod = this.filterService.mapRoadsArrayAll.find(x => x.LVRR_ID == road.LVRR_ID);
    var clone = Object.create(findRoad2);
    if (!findRoadForGetMethod.checkedFilter) {
      findRoadForGetMethod.checkedFilter = true;
      findRoad2.checkedFilter=null;
      findRoad2.checkedFilter = clone.checkedFilter;
      road.checkedFilter = true;
      if(findRoad!=undefined){
        findRoad.checkedFilter = true;
      }
    } else {
      findRoadForGetMethod.checkedFilter = false;
      if(findRoad!=undefined){
        findRoad.checkedFilter = false;
      }
      for (var i = 0; i < this.filterService.roadTab2.length; i++) {
        if (this.filterService.roadTab2[i].LVRR_ID == clone.LVRR_ID) {
          this.filterService.roadTab2[i].checkedFilter=false;
        }
      }
      road.checkedFilter = false;
    }
    if (road.districtId == 1411) { //-->spera
      this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    } else if (road.districtId == 1406) {  //Nadir
      this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
    else if (road.districtId == 1403) {
      this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoadForGetMethod.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
    else if (road.districtId == 1410) {
      this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
    else if (road.districtId == 1402) {
      this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
    else if (road.districtId == 1412) {
      this.layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
    else if (road.districtId == 1407) {
      this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
    else if (road.districtId == 1413) {
      this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
    else if (road.districtId == 1404) {
      this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
    else if (road.districtId == 1408) {
      this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
    else if (road.districtId == 1401) {
      this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
            layer.feature.geometry.type = 'editMapRoad';
            layer.setStyle(
              {color: '#009111', weight: 8}
            );
            layer.closePopup();
          }
        }
      });
    }
    else if (road.districtId == 1405) {
      this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7.eachLayer(function (layer) {
        if (layer.feature.properties.LVRR_ID === road.LVRR_ID) {
          if (layer.feature.geometry.type === 'editMapRoad') {
            layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
            layer.feature.geometry.type = 'editMapRoadSelection';
            layer.feature.properties.name = findRoad.name;
            layer.openPopup();
            setTimeout(function () {
              layer.closePopup();
            }, 1100, true);
          } else if (layer.feature.geometry.type === 'editMapRoadSelection') {
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
  roadTablesSyncronization() {
    this.roadsComponent.roadsTab1.forEach(e => {
      e.checked = false;
      e.checkedFilter = false;
    });
    this.filterService.mapRoadsArrayAll.forEach(e => {
      e.checked = false;
      e.checkedFilter = false;
    });
    if (this.roadsComponent.roadsTab1.length > 0 &&  this.filterService.mapRoadsArrayAll.length> 0  && this.filterService.roadTab2.length  > 0) {
      this.filterService.roadTab2.forEach(e => {
        var findRoadForGetMethod = this.filterService.mapRoadsArrayAll.find(x => x.LVRR_ID == e.LVRR_ID);
        findRoadForGetMethod.checked = true;
        findRoadForGetMethod.checkedFilter = e.checkedFilter;
        var road = this.roadsComponent.roadsTab1.find(x => x.LVRR_ID == e.LVRR_ID);
        if(road!=undefined){
          road.checked = true;
          road.checkedFilter = e.checkedFilter;
        }else{
          var roadTab1FalseAllCheck = this.roadsComponent.roadsTab1FalseAllCheck.find(x => x.LVRR_ID == e.LVRR_ID);
          if(roadTab1FalseAllCheck!=undefined){
            this.roadsComponent.roadsTab1.push(findRoadForGetMethod);
          }
        }
      });
    }
  }
  public updateFilter() {
    this.roadsComponent.nameFilter=this.nameFilter;
    this.roadsComponent.orderCol=this.orderCol;
    this.roadsComponent.descAsc=this.descAsc;
    this.roadsComponent.sqlInFclass=this.sqlInFclass;
    this.roadsComponent.sqlInRoadConditions=this.sqlInRoadConditions;
    this.roadsComponent.roadWayRadio=this.roadWayRadio;
    this.roadsComponent.maxSpeedFilter=this.maxSpeedFilter;
    this.roadsComponent.bridgeFilter=this.bridgeFilter;
    this.roadsComponent.agriculturFacilitationFilter=this.agriculturFacilitationFilter;
    this.roadsComponent.getRoadsPyParams();
  }
  public updateNameVillageFilter() {
    this.villagesComponent.updateFilters(this.villageNameFilter);
  }
  public updateNameFilterTabFacilities() {
    this.facilitiesComponent.updateFilters(this.nameFilterFacilitie);
  }
  public updateCoreDataFilter() {
    this.coreDataComponent.updateFilters(this.coreDataLabelFilter);
  }
  public updateFilterTabFacilities() {
    this.facilitiesComponent.getFiltersType(this.typeFacilities);
  }

  public selectAllCheckMethod() {
    if (!this.selectAllCheck ) {
      this.roadsComponent.roadsTab1.forEach(element => {
        element.checked = false;
        this.filterService.roadTab2.splice(0, this.filterService.roadTab2.length);
        this.selectionArrayRoads.splice(0, this.selectionArrayRoads.length);
      });
    } else {
      this.roadsComponent.roadsTab1.forEach(element => {
        element.checked = true;
        this.roadsToMap.push(element);
        element.checkedFilter = false;
        this.filterService.roadTab2.push(element);
        this.selectionArrayRoads.push(element);
      });
    }
  }

  public showAllCheckedRoads() {
    this.roadsComponent.showAllCheckRoads=this.showAllCheckRoads;
    this.roadsComponent.getRoadsPyParams();
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
        marker = L.marker([element.north, element.east]);
        if (element.type == 'District Centre') {
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
                         <td colspan="2">' + 'Center Type: ' + element.centerType + '</td>\
                    </tr>\
                </table>';
          marker.bindPopup(popupContent, {autoClose: true});
          marker.setIcon(icon);
          marker.customId = (element.id).toString() + element.type;
        } else if (element.type == 'Education Centre') {
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
                         <td colspan="2">' + 'Name: ' + element.label + '</td>\
                    </tr>\
                     <tr>\
                         <td colspan="2">' + 'Type: ' + element.type + '</td>\
                    </tr>\
                </table>';
          marker.bindPopup(popupContent, {autoClose: true});
          marker.setIcon(icon);
          marker.customId = (element.id).toString() + element.type;
        } else if (element.type == 'Mosque') {
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
                         <td colspan="2">' + 'Name: ' + element.label + '</td>\
                    </tr>\
                     <tr>\
                         <td colspan="2">' + 'Type: ' + element.type + '</td>\
                    </tr>\
                </table>';
          marker.bindPopup(popupContent, {autoClose: true});
          marker.setIcon(icon);
          marker.customId = (element.id).toString() + element.type;
        } else if (element.type == 'Polling Centre') {
          var icon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          var popupContent = '<table>\
                     <tr>\
                         <td colspan="2">' + 'Name: ' + element.label + '</td>\
                    </tr>\
                     <tr>\
                         <td colspan="2">' + 'Type: ' + element.type + '</td>\
                    </tr>\
                </table>';
          marker.bindPopup(popupContent, {autoClose: true});
          marker.setIcon(icon);
          marker.customId = (element.id).toString() + element.type;
        } else if (element.type == 'Government Office') {
          var icon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          var popupContent = '<table>\
                     <tr>\
                         <td colspan="2">' + 'Name: ' + element.label + '</td>\
                    </tr>\
                     <tr>\
                         <td colspan="2">' + 'Type: ' + element.type + '</td>\
                    </tr>\
                </table>';
          marker.bindPopup(popupContent, {autoClose: true});
          marker.setIcon(icon);
          marker.customId = (element.id).toString() + element.type;
        } else if (element.type == 'Health Centre') {
          var icon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          var popupContent = '<table>\
                     <tr>\
                         <td colspan="2">' + 'Name: ' + element.label + '</td>\
                    </tr>\
                     <tr>\
                         <td colspan="2">' + 'Type: ' + element.type + '</td>\
                    </tr>\
                </table>';
          marker.bindPopup(popupContent, {autoClose: true});
          marker.setIcon(icon);
          marker.customId = (element.id).toString() + element.type;
        }
        marker.addTo(this.myMap);
        this.markers.push(marker);
        if (element.checkedFilter) {
          marker.openPopup();
        }
      });
    }
  }

  public addVillagesToMap() {
    if (this.filterService.villagesArray) {
      var marker;
      this.filterService.villagesArray.forEach(element => {
        marker = L.marker([element.mapLat, element.mapLong]);
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
                         <td colspan="2">' + 'Name: ' + element.villageName + '</td>\
                    </tr>\
                     <tr>\
                         <td colspan="2">' + 'Population: ' + element.villagePop + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + 'Map Lat: ' + element.mapLat + '</td>\
                    </tr>\
                     <tr>\
                        <td colspan="2">' + 'Map Long: ' + element.mapLong + '</td>\
                    </tr>\
                </table>';
        marker.bindPopup(popupContent, {autoClose: true});
        marker.setIcon(icon);
        marker.villageId = element.id;
        marker.addTo(this.myMap);
        this.markers.push(marker);
        if (element.checkedFilter) {
          marker.openPopup();
        }
      });
      window.dispatchEvent(new Event('resize'));
    }
  }
  public setRoadsToMap() {
    this.removeAllSelectedDistrictRoadsFromMap();
    for (let i = 0; i < this.filterService.mapRoadsArrayAll.length; i++) {
      var LVRR_ID = this.filterService.mapRoadsArrayAll[i].LVRR_ID;
      var checked =this.filterService.mapRoadsArrayAll[i].checked;
      if (this.currentNum_district_code == 1411) { //-->spera
        this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      } else if (this.currentNum_district_code == 1406) {  //Nadir
        this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
      else if (this.currentNum_district_code == 1403) { //gurbuz
        this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
      else if (this.currentNum_district_code == 1410) {
        this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
      else if (this.currentNum_district_code == 1402) {
        this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
      else if (this.currentNum_district_code == 1412) {
        this.layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
      else if (this.currentNum_district_code == 1407) {
        this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
      else if (this.currentNum_district_code == 1413) {
        this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
      else if (this.currentNum_district_code == 1404) {
        this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
      else if (this.currentNum_district_code == 1408) {
        this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
      else if (this.currentNum_district_code == 1401) {
        this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
      else if (this.currentNum_district_code == 1405) {
        this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == true) {
            if (layer.feature.geometry.type == 'editMapRoadSelection') {
              layer.setStyle({color: '#910002', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoadSelection';
            } else {
              layer.setStyle({color: '#009111', weight: 8});  //color:'#ffff00'
              layer.feature.geometry.type = 'editMapRoad';
            }
          } else if (layer.feature.properties.LVRR_ID === LVRR_ID && checked == false) {
            layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'SelectedMultiLineString';
            layer.closePopup();
          }
        });
      }
    }
  }
  public removeAllSelectedDistrictRoadsFromMap() {
    if (this.currentNum_district_code == 1411) { //-->spera
      this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    } else if (this.currentNum_district_code == 1406) {  //Nadir
      this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1403) { //gurbuz
      this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1410) {
      this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1402) {
      this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1412) {
      this.layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1407) {
      this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1413) {
      this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1404) {
      this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1408) {
      this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1401) {
      this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1405) {
      this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.closePopup();
      });
    }
  }
  public removeAllRoadsFromMap() {
    this.filterService.roadTab2 = [];
    this.roadsTab1 = [];
    if (this.currentNum_district_code == 1411) { //-->spera
      this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    } else if (this.currentNum_district_code == 1406) {  //Nadir
      this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1403) { //gurbuz
      this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1410) {
      this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9.eachLayer(function (layer) {

        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1402) {
      this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1412) {
      this.layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1407) {
      this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1413) {
      this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1404) {
      this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1408) {
      this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1401) {
      this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
    else if (this.currentNum_district_code == 1405) {
      this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7.eachLayer(function (layer) {
        layer.setStyle({color: '#d7e3ff', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }
  }
  public switchTab($event: MatTabChangeEvent) {
    var tab = $event.index;
    this.tab = tab;
    this.filterService.tab = tab;
    if (tab == 0) {

      this.villagesComponent.villages=[];
      this.facilitiesComponent.finalfacilitiesMerged=[];
      this.loadingMap=true;
      setTimeout(() => {
        if(this.role=='admin'){
          this.coreDataComponent.emptyTable();
        }
        this.roadTablesSyncronization();
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName); //mhn kaleseis thn get sou gia ta fereis ta facilities
        this.removeAllMarkersFromMap();//
        this.setRoadsToMap(); //
        this.addFacilitiesToMap();
        this.addVillagesToMap();
        setTimeout(() => {
            this.loadingMap=false;
          },500
        );
      }, 500)
    } else if (tab == 1) {
      this.villagesComponent.villages=[];
      this.facilitiesComponent.finalfacilitiesMerged=[];
      this.ngOnDestroy();
      this.roadsComponent.currentNum_district_code=this.currentNum_district_code;
      this.roadsComponent.currentNum_district_code=this.currentNum_district_code;
      this.roadsComponent.loading=true;
      setTimeout(() => {
        this.roadsComponent.loading=false;
      }, 400);
      if(this.role=='admin'){
        this.coreDataComponent.emptyTable();
      }
      window.dispatchEvent(new Event('resize'));
      this.roadTablesSyncronization();
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (195) + 'px';
        }
      }, 200, false);
    } else if (tab == 2) {
      this.villagesComponent.villages=[];
      if(this.role=='admin'){
        this.coreDataComponent.emptyTable();
      }      this.initMapRoadsArray();
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (193) + 'px';
        }
      }, 0, false);
    } else if (tab == 3) {
      this.facilitiesComponent.finalfacilitiesMerged=[];
      this.initMapRoadsArray();
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.enableNgx();
      if(this.role=='admin'){
        this.coreDataComponent.emptyTable();

      }      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (193) + 'px';
        }
      }, 0, false);
    } else if (tab == 4) {
      this.facilitiesComponent.finalfacilitiesMerged=[];
      this.villagesComponent.villages=[];
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.coreDataComponent.getCriteriaMaster();
      // window.addEventListener('resize', function(event) {
      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (199) + 'px';
        }
      }, 0, false);
    }
    window.dispatchEvent(new Event('resize'));
  }
  public initMapRoadsArray() { //
    this.filterService.mapRoadsArray.splice(0, this.selectionArrayRoads.length);
    var tempRoads = [];
    tempRoads = this.roadsTab1;
    for (let i = 0; i < tempRoads.length; i++) {
      this.filterService.mapRoadsArray.push(tempRoads[i]);
    }
  }
  updateFiterFclass(e) {
    var sqlIn = '(' + e.toString() + ')';
    this.sqlInFclass = sqlIn;
    this.roadsComponent.sqlInFclass = sqlIn;
    this.roadsComponent.getRoadsPyParams();
  }
  updateRoadConditionFilter(e) {
    var checks = [];
    checks = e;
    var sqlIn = '(' + e.toString() + ')';
    this.sqlInRoadConditions = sqlIn;
    this.roadsComponent.sqlInRoadConditions = sqlIn;
    this.roadsComponent.getRoadsPyParams();
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
  selectDistrict(district, param) {
    this.districtChange=true;
    this.roadsComponent.districtChange=true;
    this.removeAllMarkersFromMap();
    this.showAllCheckRoads=false;
    this.roadsComponent.showAllCheckRoads=false;
    this.villagesComponent.userSelectionsForMapShow = [];
    this.villagesComponent.villages = [];
    this.facilitiesComponent.userSelectionsForMapShow = [];
    this.facilitiesComponent.facilitiesMerged = [];
    this.selectAllCheck = false;
    this.selectAllCheckFacilities = false;
    this.selectAllCheckVillages = false;
    this.filterService.facilitiesArray = [];
    this.filterService.villagesArray = [];
    this.orderCol = 'LVRR_ID';
    this.descAsc = 'asc';
    if (param == 'manual') {
      this.removeAllRoadsFromMap();
      localStorage.setItem('districtItemName', district[0].district_name);
      localStorage.setItem('num_district_code', district[0].num_district_code);
      localStorage.setItem('distId', district[0].id);
      localStorage.setItem('x_distance', district[0].x_distance);
      localStorage.setItem('y_distance', district[0].y_distance);
      localStorage.setItem('zoom_info_district', district[0].zoom_info_district);
    }
    if(this.changeModeArray.length>0){
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        if (layer.feature.properties.dist_name_ == 'Jaji Maidan') {
          layer.setStyle({fillColor: 'rgba(190,213,122,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Baak'){
          layer.setStyle({fillColor: 'rgba(188,200,128,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Sabari'){
          layer.setStyle({fillColor: 'rgba(178,208,182,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Musa Khel'){
          layer.setStyle({fillColor: 'rgba(224,181,128,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Qalandar'){
          layer.setStyle({fillColor: 'rgba(168,213,148,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Nadir Shah Kot'){
          layer.setStyle({fillColor: 'rgba(185,162,188,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Shamul'){
          layer.setStyle({fillColor: 'rgba(218,153,183,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Tanay'){
          layer.setStyle({fillColor: 'rgba(222,211,121,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Gurbuz'){
          layer.setStyle({fillColor: 'rgba(166,199,154,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Khost'){
          layer.setStyle({fillColor: 'rgba(218,160,146,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Manduzay'){
          layer.setStyle({fillColor: 'rgba(225,153,128,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Tirzayee'){
          layer.setStyle({fillColor: 'rgba(170,179,176,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Spera'){
          layer.setStyle({fillColor: 'rgba(220,150,158,0.4470588235294118)'});
        }
        layer.feature.geometry.type = 'MultiPolygonMode';
      });
    }else{
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        if (layer.feature.properties.dist_name_ == 'Jaji Maidan') {
          layer.setStyle({fillColor: 'rgba(190,213,122,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Baak'){
          layer.setStyle({fillColor: 'rgba(188,200,128,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Sabari'){
          layer.setStyle({fillColor: 'rgba(178,208,182,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Musa Khel'){
          layer.setStyle({fillColor: 'rgba(224,181,128,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Qalandar'){
          layer.setStyle({fillColor: 'rgba(168,213,148,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Nadir Shah Kot'){
          layer.setStyle({fillColor: 'rgba(185,162,188,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Shamul'){
          layer.setStyle({fillColor: 'rgba(218,153,183,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Tanay'){
          layer.setStyle({fillColor: 'rgba(222,211,121,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Gurbuz'){
          layer.setStyle({fillColor: 'rgba(166,199,154,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Khost'){
          layer.setStyle({fillColor: 'rgba(218,160,146,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Manduzay'){
          layer.setStyle({fillColor: 'rgba(225,153,128,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Tirzayee'){
          layer.setStyle({fillColor: 'rgba(170,179,176,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Spera'){
          layer.setStyle({fillColor: 'rgba(220,150,158,1.0)'});
        }
        layer.feature.geometry.type = 'MultiPolygon';
      });
    }
    this.highlightOnDistrictByName(district[0]);
    this.hilightSelectedroadsDistrict(district[0]);
    this.currentNum_district_code = district[0].num_district_code;
    this.currentDistrictName = district[0].district_name;
    this.roadsComponent.currentNum_district_code=this.currentNum_district_code;
    this.roadsComponent.currentNum_district_code=this.currentNum_district_code;
    this.filterService.loadingMap=true;
    this.roadsComponent.getRoadsPyParams();
    if (this.tab == 2) {
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
    } else if (this.tab == 3) {
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
    } else {
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
    }
  }
  public hilightSelectedroadsDistrict(district) {
    if (district.district_name == 'Jaji Maidan') {
      this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Baak'){
      this.layer_Khost_Province_Baak_District_OSM_roads_UTM42n_2.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Sabari'){
      this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Musa Khel'){
      this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Qalandar'){
      this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Nadir Shah Kot'){
      this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Shamul'){
      this.layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Tanay'){
      this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Gurbuz'){
      this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Khost'){
      this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Manduzay'){
      this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Tirzayee'){
      this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }else if (district.district_name == 'Spera'){
      this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        layer.setStyle({color: '#004DFF', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'SelectedMultiLineString';
        layer.closePopup();
      });
    }
  }
  public highlightOnDistrictByName(district) {
    if(this.changeModeArray.length>0){
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        if (layer.feature.properties.dist_name_ == district.district_name) {
          layer.setStyle({fillColor: '#fff0488f'});
          layer.openPopup();
          layer.feature.geometry.type = 'editRow';
        }
      });
      if (district.x_distance != null && district.y_distance != null) {
        this.myMap.setView([district.x_distance, district.y_distance], district.zoom_info_district);
      }
    }else{
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
  }
  public getJSON(): Observable<any> {
    return this.http.get(this.remoteDataService.imageURL + '?docId=' +135);
  }
  ngAfterViewInit(): void {
    this.loadingMap=true;
    this.geoSub= this.getJSON().subscribe(data => {
      this.loadingMap=false;
      this.selectionArrayRoads = [];
      this.diakopthsDromwn = true;
      this.roadsTab1 = [];
      this.json_Districts_422_AGCHO2018_UTM42n_1=data;
      this.initGlobalMap();
      this.district = [];
      this.province = [];
      if ((localStorage.getItem('num_province_code') != 'null' && localStorage.getItem('num_district_code') != 'null') && (localStorage.getItem('num_province_code') != null && localStorage.getItem('num_district_code') != null)) {
        this.province[0] = {
          'itemName': localStorage.getItem('provinceItemName'),
          'num_province_code': Number(localStorage.getItem('num_province_code')),
          'province_name': localStorage.getItem('provinceItemName')
        };
        this.selectProvince(this.province, 'ngOninit');
        this.district[0] = {
          'alpha_district_code': Number(localStorage.getItem('num_district_code')),
          'itemName': localStorage.getItem('districtItemName'),
          'num_district_code': Number(localStorage.getItem('num_district_code')),
          'district_name': localStorage.getItem('districtItemName'),
          'id': Number(localStorage.getItem('distId')),
          'x_distance': Number(localStorage.getItem('x_distance')),
          'y_distance': Number(localStorage.getItem('y_distance')),
          'zoom_info_district': Number(localStorage.getItem('zoom_info_district')),
        };
        setTimeout(() => {
          this.selectDistrict(this.district, 'ngOninit');
        }, 900);
        //district_name
      } else if (localStorage.getItem('num_province_code') != 'null' && localStorage.getItem('num_province_code') != null) {
        this.province[0] = {
          'itemName': localStorage.getItem('provinceItemName'),
          'num_province_code': Number(localStorage.getItem('num_province_code')),
          'province_name': localStorage.getItem('provinceItemName')
        };
        this.selectProvince(this.province, 'ngOninit');
      }
    });
  }
  public selectAllCheckMethodFacilities() {
    this.facilitiesComponent.selectAllCheckMethod(this.selectAllCheckFacilities);
  }
  public showAllCheckedFacilities() {
    this.facilitiesComponent.showAllCheckedFacilities(this.showAllCheckFacilities);
  }
  public showAllCheckedVillages() {
    this.villagesComponent.showAllCheckedVillages(this.showAllCheckVillages);
  }
  public selectAllCheckMethodVillages() {
    this.villagesComponent.selectAllCheckMethod(this.selectAllCheckVillages);
  }
  private __getElementByClass(className: string): HTMLElement {
    const element = <HTMLElement>document.querySelector(`.${className}`);
    return element;
  }
  public changeMode(){
    if(this.changeModeArray.length>0){
      this.changeModeArray.forEach(element => {
        this.myMap.removeLayer(element);
      });
      this.changeModeArray=[];
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        if (layer.feature.properties.dist_name_ == 'Jaji Maidan') {
          layer.setStyle({fillColor: 'rgba(190,213,122,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Baak'){
          layer.setStyle({fillColor: 'rgba(188,200,128,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Sabari'){
          layer.setStyle({fillColor: 'rgba(178,208,182,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Musa Khel'){
          layer.setStyle({fillColor: 'rgba(224,181,128,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Qalandar'){
          layer.setStyle({fillColor: 'rgba(168,213,148,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Nadir Shah Kot'){
          layer.setStyle({fillColor: 'rgba(185,162,188,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Shamul'){
          layer.setStyle({fillColor: 'rgba(218,153,183,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Tanay'){
          layer.setStyle({fillColor: 'rgba(222,211,121,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Gurbuz'){
          layer.setStyle({fillColor: 'rgba(166,199,154,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Khost'){
          layer.setStyle({fillColor: 'rgba(218,160,146,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Manduzay'){
          layer.setStyle({fillColor: 'rgba(225,153,128,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Tirzayee'){
          layer.setStyle({fillColor: 'rgba(170,179,176,1.0)'});
        }else if (layer.feature.properties.dist_name_ == 'Spera'){
          layer.setStyle({fillColor: 'rgba(220,150,158,1.0)'});
        }
        layer.feature.geometry.type = 'MultiPolygon';
      });
      var currentDistrict = this.currentDistrictName;
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        if (layer.feature.properties.dist_name_ == currentDistrict) {
          layer.setStyle({fillColor: '#ffff00'});
          layer.feature.geometry.type = 'editRow';
        }
      });
    }else{
      var bounds_group = new L.featureGroup([]);
      this.myMap.createPane('pane_ShadedreliefKhostUTM42n_0');//
      this.myMap.getPane('pane_ShadedreliefKhostUTM42n_0').style.zIndex = 403;
      var img_ShadedreliefKhostUTM42n_0 =this.remoteDataService.imageURL + '?docId=' +133;
      var img_bounds_ShadedreliefKhostUTM42n_0 = [[32.84103911135089,69.0882851687274],[33.9123098127972,70.5131406575886]];
      var layer_ShadedreliefKhostUTM42n_0 = new L.imageOverlay(img_ShadedreliefKhostUTM42n_0,
        img_bounds_ShadedreliefKhostUTM42n_0,
        {pane: 'pane_ShadedreliefKhostUTM42n_0'});
      bounds_group.addLayer(layer_ShadedreliefKhostUTM42n_0);
      this.myMap.addLayer(layer_ShadedreliefKhostUTM42n_0);
      this.changeModeArray.push(layer_ShadedreliefKhostUTM42n_0);
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        if (layer.feature.properties.dist_name_ == 'Jaji Maidan') {
          layer.setStyle({fillColor: 'rgba(190,213,122,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Baak'){
          layer.setStyle({fillColor: 'rgba(188,200,128,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Sabari'){
          layer.setStyle({fillColor: 'rgba(178,208,182,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Musa Khel'){
          layer.setStyle({fillColor: 'rgba(224,181,128,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Qalandar'){
          layer.setStyle({fillColor: 'rgba(168,213,148,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Nadir Shah Kot'){
          layer.setStyle({fillColor: 'rgba(185,162,188,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Shamul'){
          layer.setStyle({fillColor: 'rgba(218,153,183,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Tanay'){
          layer.setStyle({fillColor: 'rgba(222,211,121,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Gurbuz'){
          layer.setStyle({fillColor: 'rgba(166,199,154,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Khost'){
          layer.setStyle({fillColor: 'rgba(218,160,146,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Manduzay'){
          layer.setStyle({fillColor: 'rgba(225,153,128,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Tirzayee'){
          layer.setStyle({fillColor: 'rgba(170,179,176,0.4470588235294118)'});
        }else if (layer.feature.properties.dist_name_ == 'Spera'){
          layer.setStyle({fillColor: 'rgba(220,150,158,0.4470588235294118)'});
        }
        layer.feature.geometry.type = 'MultiPolygonMode';
      });
      var currentDistrict = this.currentDistrictName;
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        if (layer.feature.properties.dist_name_ == currentDistrict) {
          layer.setStyle({fillColor: '#fff0488f'});
          layer.feature.geometry.type = 'editRow';
        }
      });
    }
  }
  private initMap(filterService, roadTab2, drawerMapSelections, currentStatusMapSelection): void {
    $(window).resize(function () {
      if (filterService.tab == 1) {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (195) + 'px';
        }
      } else if (filterService.tab == 2) {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (193) + 'px';
        }
      } else if (filterService.tab == 3) {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (193) + 'px';
        }
      } else if (filterService.tab == 4) {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (199) + 'px';
        }
      }
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 900);
    });
    this.myMap.setView([33.857, 67.756], 6.5);
    var highlightLayer;

    function highlightFeature(e) {
      highlightLayer = e.target;
      if (e.target.feature.geometry.type === 'MultiLineString') {
        highlightLayer.setStyle(
          {color: '#00ff17', weight: 8}
        );

      }else if (e.target.feature.geometry.type === 'SelectedMultiLineString') {
        highlightLayer.setStyle( {color: '#00ff17', weight: 8});

      } else if (e.target.feature.geometry.type === 'MultiPolygon') {
        highlightLayer.setStyle({
          fillColor: '#ffff00',
          fillOpacity: 1
        });
      } else if (e.target.feature.geometry.type === 'MultiPolygonMode') {
        highlightLayer.setStyle({
          fillColor: '#fff0488f',
          fillOpacity: 3
        });
      } else if (e.target.feature.geometry.type === 'editMapRoad') {
        highlightLayer.openPopup();
        highlightLayer.setStyle({
          color: '#00ff17',
          fillOpacity: 1
        });
      } else if (e.target.feature.geometry.type === 'editMapRoadSelection') {//editMapRoadSelection
        highlightLayer.openPopup();
        highlightLayer.setStyle({
          color: '#ff100e',
          fillOpacity: 1
        });
      }
    }
    function highlightFeatureOnClick(e) {
      if (e.target.feature.geometry.type == 'SelectedMultiLineString') {
        filterService.countHits = filterService.countHits + 1;
        if (filterService.countHits == 1) {
          drawerMapSelections.toggle().finally(() => {
            window.dispatchEvent(new Event('resize'));
          });
          currentStatusMapSelection = !currentStatusMapSelection;
        }
        var findRoadForGetMethod = filterService.mapRoadsArrayAll.find(x => x.LVRR_ID == e.target.feature.properties.LVRR_ID);
        var clone = Object.create(findRoadForGetMethod);
        clone.checked=true;
        clone.checked=false;
        filterService.roadTab2.push(clone);
        e.target.feature.geometry.type = 'editMapRoad';
        highlightLayer.setStyle(
          {color: '#009111', weight: 8}
        );

      } else if (e.target.feature.geometry.type == 'editMapRoad') {  //editMapRoadSelection
        e.target.feature.geometry.type = 'SelectedMultiLineString';
        highlightLayer.setStyle(
          {color: '#00ff17', weight: 8}
        );
        for (var i = 0; i < filterService.roadTab2.length; i++) {
          if (filterService.roadTab2[i].LVRR_ID == e.target.feature.properties.LVRR_ID) {
            filterService.roadTab2.checkedFilter=false;
            filterService. roadTab2.splice(i, 1);
          }
        }
      }
    }
    function unhighlightFeature(e) {
      if (e.target.feature.geometry.type === 'MultiLineString') {
        for (var i in e.target._eventParents) {
          e.target._eventParents[i].resetStyle(e.target);
        }
      }
      else if (e.target.feature.geometry.type === 'SelectedMultiLineString') {
        for (var i in e.target._eventParents) {
          e.target.setStyle({color: '#004DFF', weight: 1});
        }
      }
      else if (e.target.feature.geometry.type === 'editMapRoad') {
        highlightLayer.closePopup();
        highlightLayer.setStyle(
          {color: '#009111', weight: 8}
        );
      } else if (e.target.feature.geometry.type === 'editMapRoadSelection') {
        highlightLayer.closePopup();
        highlightLayer.setStyle(
          {color: '#910002', weight: 8}
        );
      }
    }

    function unhighlightFeaturePolygon(e) {
      if (e.target.feature.geometry.type === 'MultiPolygon') {
        for (var i in e.target._eventParents) {
          if (e.target.feature.properties.dist_name_ == 'Jaji Maidan') {
            e.target.setStyle({fillColor: 'rgba(190,213,122,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Baak'){
            e.target.setStyle({fillColor: 'rgba(188,200,128,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Sabari'){
            e.target.setStyle({fillColor: 'rgba(178,208,182,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Musa Khel'){
            e.target.setStyle({fillColor: 'rgba(224,181,128,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Qalandar'){
            e.target.setStyle({fillColor: 'rgba(168,213,148,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Nadir Shah Kot'){
            e.target.setStyle({fillColor: 'rgba(185,162,188,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Shamul'){
            e.target.setStyle({fillColor: 'rgba(218,153,183,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Tanay'){
            e.target.setStyle({fillColor: 'rgba(222,211,121,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Gurbuz'){
            e.target.setStyle({fillColor: 'rgba(166,199,154,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Khost'){
            e.target.setStyle({fillColor: 'rgba(218,160,146,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Manduzay'){
            e.target.setStyle({fillColor: 'rgba(225,153,128,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Tirzayee'){
            e.target.setStyle({fillColor: 'rgba(170,179,176,1.0)'});
          }else if (e.target.feature.properties.dist_name_ == 'Spera'){
            e.target.setStyle({fillColor: 'rgba(220,150,158,1.0)'});
          }
        }
      }else if(e.target.feature.geometry.type === 'MultiPolygonMode'){
        if (e.target.feature.properties.dist_name_ == 'Jaji Maidan') {
          e.target.setStyle({fillColor: 'rgba(190,213,122,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Baak'){
          e.target.setStyle({fillColor: 'rgba(188,200,128,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Sabari'){
          e.target.setStyle({fillColor: 'rgba(178,208,182,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Musa Khel'){
          e.target.setStyle({fillColor: 'rgba(224,181,128,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Qalandar'){
          e.target.setStyle({fillColor: 'rgba(168,213,148,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Nadir Shah Kot'){
          e.target.setStyle({fillColor: 'rgba(185,162,188,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Shamul'){
          e.target.setStyle({fillColor: 'rgba(218,153,183,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Tanay'){
          e.target.setStyle({fillColor: 'rgba(222,211,121,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Gurbuz'){
          e.target.setStyle({fillColor: 'rgba(166,199,154,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Khost'){
          e.target.setStyle({fillColor: 'rgba(218,160,146,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Manduzay'){
          e.target.setStyle({fillColor: 'rgba(225,153,128,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Tirzayee'){
          e.target.setStyle({fillColor: 'rgba(170,179,176,0.4470588235294118)'});
        }else if (e.target.feature.properties.dist_name_ == 'Spera'){
          e.target.setStyle({fillColor: 'rgba(220,150,158,0.4470588235294118)'});
        }
      }
    }
    this.myMap.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
    var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_KhostProvincedistrictsKhost_Province_UTM42n_1_0() {
      return {
        pane: 'pane_KhostProvincedistrictsKhost_Province_UTM42n_1',
        opacity: 1,
        color: 'rgba(35,35,35,1.0)', //
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 1.0,
        fill: true,
        fillOpacity: 1,
        interactive: true,
      };
    }
    this.myMap.createPane('pane_KhostProvincedistrictsKhost_Province_UTM42n_1');
    this.myMap.getPane('pane_KhostProvincedistrictsKhost_Province_UTM42n_1').style.zIndex = 404;
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
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
      if (layer.feature.properties.dist_name_ == 'Jaji Maidan') {
        layer.setStyle({fillColor: 'rgba(190,213,122,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Baak'){
        layer.setStyle({fillColor: 'rgba(188,200,128,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Sabari'){
        layer.setStyle({fillColor: 'rgba(178,208,182,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Musa Khel'){
        layer.setStyle({fillColor: 'rgba(224,181,128,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Qalandar'){
        layer.setStyle({fillColor: 'rgba(168,213,148,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Nadir Shah Kot'){
        layer.setStyle({fillColor: 'rgba(185,162,188,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Shamul'){
        layer.setStyle({fillColor: 'rgba(218,153,183,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Tanay'){
        layer.setStyle({fillColor: 'rgba(222,211,121,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Gurbuz'){
        layer.setStyle({fillColor: 'rgba(166,199,154,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Khost'){
        layer.setStyle({fillColor: 'rgba(218,160,146,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Manduzay'){
        layer.setStyle({fillColor: 'rgba(225,153,128,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Tirzayee'){
        layer.setStyle({fillColor: 'rgba(170,179,176,1.0)'});
      }else if (layer.feature.properties.dist_name_ == 'Spera'){
        layer.setStyle({fillColor: 'rgba(220,150,158,1.0)'});
      }
      layer.feature.geometry.type = 'MultiPolygon';
    });
    function style_Khost_Province_Baak_District_OSM_roads_UTM42n_2_0() {
      return {
        pane: 'pane_Khost_Province_Baak_District_OSM_roads_UTM42n_2',
        opacity: 1,
        color: '#d7e3ff',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }

    this.myMap.createPane('pane_Khost_Province_Baak_District_OSM_roads_UTM42n_2');
    this.myMap.getPane('pane_Khost_Province_Baak_District_OSM_roads_UTM42n_2').style.zIndex = 405;
    this.myMap.getPane('pane_Khost_Province_Baak_District_OSM_roads_UTM42n_2').style['mix-blend-mode'] = 'normal';
    this.layer_Khost_Province_Baak_District_OSM_roads_UTM42n_2 = new L.geoJson(json_Khost_Province_Baak_District_OSM_roads_UTM42n_2, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Baak_District_OSM_roads_UTM42n_2',
      layerName: 'layer_Khost_Province_Baak_District_OSM_roads_UTM42n_2',
      pane: 'pane_Khost_Province_Baak_District_OSM_roads_UTM42n_2',
      onEachFeature: pop_Khost_Province_Baak_District_OSM_roads_UTM42n_2,
      style: style_Khost_Province_Baak_District_OSM_roads_UTM42n_2_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Baak_District_OSM_roads_UTM42n_2);
    this.myMap.addLayer(this.layer_Khost_Province_Baak_District_OSM_roads_UTM42n_2);
    function pop_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3_0() {
      return {
        pane: 'pane_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3',
        opacity: 1,
        color: '#d7e3ff',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        weight: 1.0,
        fillOpacity: 0,
        interactive: true,
      };
    }
    this.myMap.createPane('pane_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3');
    this.myMap.getPane('pane_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3').style.zIndex = 405;
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
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4_0() {
      return {
        pane: 'pane_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4',
        opacity: 1,
        color: '#d7e3ff',
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
    this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4 = new L.geoJson(json_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4',
      layerName: 'layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4',
      pane: 'pane_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4',
      onEachFeature: pop_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4,
      style: style_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4);
    this.myMap.addLayer(this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4);

    function pop_Khost_Province_Khost_District_OSM_roads_UTM42n_5(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }

    function style_Khost_Province_Khost_District_OSM_roads_UTM42n_5_0() {
      return {
        pane: 'pane_Khost_Province_Khost_District_OSM_roads_UTM42n_5',
        opacity: 1,
        color: '#d7e3ff',
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
    this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5 = new L.geoJson(json_Khost_Province_Khost_District_OSM_roads_UTM42n_5, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Khost_District_OSM_roads_UTM42n_5',
      layerName: 'layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5',
      pane: 'pane_Khost_Province_Khost_District_OSM_roads_UTM42n_5',
      onEachFeature: pop_Khost_Province_Khost_District_OSM_roads_UTM42n_5,
      style: style_Khost_Province_Khost_District_OSM_roads_UTM42n_5_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5);
    this.myMap.addLayer(this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5);

    function pop_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6_0() {
      return {
        pane: 'pane_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6',
        opacity: 1,
        color: '#d7e3ff',
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
    this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6 = new L.geoJson(json_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6',
      layerName: 'layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6',
      pane: 'pane_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6',
      onEachFeature: pop_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6,
      style: style_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6);
    this.myMap.addLayer(this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6);
    function pop_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7_0() {
      return {
        pane: 'pane_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7',
        opacity: 1,
        color: '#d7e3ff',
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
    this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7 = new L.geoJson(json_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7',
      layerName: 'layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7',
      pane: 'pane_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7',
      onEachFeature: pop_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7,
      style: style_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7);
    this.myMap.addLayer(this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7);
    function pop_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8_0() {
      return {
        pane: 'pane_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8',
        opacity: 1,
        color: '#d7e3ff',
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
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9_0() {
      return {
        pane: 'pane_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9',
        opacity: 1,
        color: '#d7e3ff',
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
    this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9 = new L.geoJson(json_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9',
      layerName: 'layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9',
      pane: 'pane_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9',
      onEachFeature: pop_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9,
      style: style_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9);
    this.myMap.addLayer(this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9);
    function pop_Khost_Province_Sabari_District_OSM_roads_UTM42n_10(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_Khost_Province_Sabari_District_OSM_roads_UTM42n_10_0() {
      return {
        pane: 'pane_Khost_Province_Sabari_District_OSM_roads_UTM42n_10',
        opacity: 1,
        color: '#d7e3ff',
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
    this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10 = new L.geoJson(json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10',
      layerName: 'layer_Khost_Province_Sabari_District_OSM_roads_UTM42n_10',
      pane: 'pane_Khost_Province_Sabari_District_OSM_roads_UTM42n_10',
      onEachFeature: pop_Khost_Province_Sabari_District_OSM_roads_UTM42n_10,
      style: style_Khost_Province_Sabari_District_OSM_roads_UTM42n_10_0,
    });
    bounds_group.addLayer(this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10);
    this.myMap.addLayer(this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10);
    function pop_Khost_Province_Shamul_District_OSM_roads_UTM42n_11(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_Khost_Province_Shamul_District_OSM_roads_UTM42n_11_0() {
      return {
        pane: 'pane_Khost_Province_Shamul_District_OSM_roads_UTM42n_11',
        opacity: 1,
        color: '#d7e3ff',
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
    this.layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11 = new L.geoJson(json_Khost_Province_Shamul_District_OSM_roads_UTM42n_11, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Shamul_District_OSM_roads_UTM42n_11',
      layerName: 'layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11',
      pane: 'pane_Khost_Province_Shamul_District_OSM_roads_UTM42n_11',
      onEachFeature: pop_Khost_Province_Shamul_District_OSM_roads_UTM42n_11,
      style: style_Khost_Province_Shamul_District_OSM_roads_UTM42n_11_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11);
    this.myMap.addLayer(this.layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11);

    function pop_Khost_Province_Spera_District_OSM_roads_UTM42n_12(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }

    function style_Khost_Province_Spera_District_OSM_roads_UTM42n_12_0() {
      return {
        pane: 'pane_Khost_Province_Spera_District_OSM_roads_UTM42n_12',
        opacity: 1,
        color: '#d7e3ff',
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
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
      });
      var popupContent = (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '');
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_Khost_Province_Tanay_District_OSM_roads_UTM42n_13_0() {
      return {
        pane: 'pane_Khost_Province_Tanay_District_OSM_roads_UTM42n_13',
        opacity: 1,
        color: '#d7e3ff',
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
    this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13 = new L.geoJson(json_Khost_Province_Tanay_District_OSM_roads_UTM42n_13, {
      attribution: '',
      interactive: true,
      dataVar: 'json_Khost_Province_Tanay_District_OSM_roads_UTM42n_13',
      layerName: 'layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13',
      pane: 'pane_Khost_Province_Tanay_District_OSM_roads_UTM42n_13',
      onEachFeature: pop_Khost_Province_Tanay_District_OSM_roads_UTM42n_13,
      style: style_Khost_Province_Tanay_District_OSM_roads_UTM42n_13_0,
    });
    bounds_group.addLayer(this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13);
    this.myMap.addLayer(this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13);
    function pop_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14(feature, layer) {
      layer.on({
        mouseout: unhighlightFeature,
        mouseover: highlightFeature,
        click: highlightFeatureOnClick
      });
      var popupContent = (feature.properties['name'] !== null ? autolinker.link(feature.properties['name'].toLocaleString()) : '');
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
    }
    function style_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14_0() {
      return {
        pane: 'pane_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14',
        opacity: 1,
        color: '#d7e3ff',
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
  public openClosedSideNav() {
    this.drawer.toggle().finally(() => {
      window.dispatchEvent(new Event('resize'));
    });
    this.currentStatus = !this.currentStatus;
  }
  public openClosedSideNavMapSelections() {
    this.drawerMapSelections.toggle().finally(() => {
      window.dispatchEvent(new Event('resize'));
    });
    this.currentStatusMapSelection = !this.currentStatusMapSelection;
  }

  initFooter(){
    if (this.filterService.tab == 2) {
      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (193) + 'px';
        }
      }, 600, false);

    } else if (this.filterService.tab == 3) {

      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (193) + 'px';
        }
      }, 600, false);
    } else if (this.filterService.tab == 4) {
      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (199) + 'px';
        }
      }, 600, false);
    }
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
  private initGlobalMap() {
    this.myMap = L.map('map', {
      zoomControl:true, maxZoom:28, minZoom:1
    }).fitBounds([[28.22417958208312,57.02319267303923],[39.004942132581945,77.73407566160597]]);
    this.myMap.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
    var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
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
    function pop_Districts_422_AGCHO2018_UTM42n_1(feature, layer) {
      var popupContent = '<table>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['OBJECTID'] !== null ? autolinker.link(feature.properties['OBJECTID'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['Shape__Are'] !== null ? autolinker.link(feature.properties['Shape__Are'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['Shape__Len'] !== null ? autolinker.link(feature.properties['Shape__Len'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['prov_name_'] !== null ? autolinker.link(feature.properties['prov_name_'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['dist_name_'] !== null ? autolinker.link(feature.properties['dist_name_'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['alt_dist_n'] !== null ? autolinker.link(feature.properties['alt_dist_n'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['If_Perm_or'] !== null ? autolinker.link(feature.properties['If_Perm_or'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['Dist_chang'] !== null ? autolinker.link(feature.properties['Dist_chang'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['prov_id_42'] !== null ? autolinker.link(feature.properties['prov_id_42'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['prov_id_43'] !== null ? autolinker.link(feature.properties['prov_id_43'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['dist_id_42'] !== null ? autolinker.link(feature.properties['dist_id_42'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['dist_id_43'] !== null ? autolinker.link(feature.properties['dist_id_43'].toLocaleString()) : '') + '</td>\
                    </tr>\
                    <tr>\
                        <td colspan="2">' + (feature.properties['Disambigua'] !== null ? autolinker.link(feature.properties['Disambigua'].toLocaleString()) : '') + '</td>\
                    </tr>\
                </table>';
      layer.bindPopup(popupContent, {maxHeight: 400});
    }
    function style_Districts_422_AGCHO2018_UTM42n_1_0() {
      return {
        pane: 'pane_Districts_422_AGCHO2018_UTM42n_1',
        opacity: 1,
        color: 'rgba(35,35,35,1.0)',
        dashArray: '',
        lineCap: 'butt',
        lineJoin: 'miter',
        weight: 1.0,
        fill: true,
        fillOpacity: 1,
        fillColor: 'rgba(252,226,175,1.0)',
        interactive: true,
      }
    }
    this.myMap.createPane('pane_Districts_422_AGCHO2018_UTM42n_1');
    this.myMap.getPane('pane_Districts_422_AGCHO2018_UTM42n_1').style.zIndex = 401;
    this.myMap.getPane('pane_Districts_422_AGCHO2018_UTM42n_1').style['mix-blend-mode'] = 'normal';
    var layer_Districts_422_AGCHO2018_UTM42n_1 = new L.geoJson(this.json_Districts_422_AGCHO2018_UTM42n_1, {//
      attribution: '',
      interactive: true,
      dataVar: 'json_Districts_422_AGCHO2018_UTM42n_1',
      layerName: 'layer_Districts_422_AGCHO2018_UTM42n_1',
      pane: 'pane_Districts_422_AGCHO2018_UTM42n_1',
      onEachFeature: pop_Districts_422_AGCHO2018_UTM42n_1,
      style: style_Districts_422_AGCHO2018_UTM42n_1_0,
    });
    this.layer_Districts_422_AGCHO2018_UTM42n_1=layer_Districts_422_AGCHO2018_UTM42n_1;
    bounds_group.addLayer(this.layer_Districts_422_AGCHO2018_UTM42n_1);
    this.myMap.addLayer(this.layer_Districts_422_AGCHO2018_UTM42n_1);
    setBounds();
  }

  photoGalley(item) {
    const dialogRef = this.dialog.open(PhotoGallery, {
      data: {
        "id":item.id
      },
      width: '1080px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.tab == 0) {
        item.docSize = -1;
      } else {
        item.docSize = 0;
      }
      this.dataservice.getPhotoByRoadId({'id': item.id}).subscribe(res => {
        item.docSize = res.total;
        window.dispatchEvent(new Event('resize'));
      });
    });
  }
  notes(item) {
    const drawer = this.__getElementByClass('drawer-map-selection');
    const dialogRef = this.dialog.open(NotesDialog, {//
      data: item,
      width: '1110px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.tab == 0) {
        item.notesSize = -1;
      } else {
        item.notesSize = 0;
      }
      this.dataservice.getNoteByRoadId({'roadId': item.id}).subscribe(res => {
        item.notesSize = res.total;
      });
    });
  }
  myProfile(){
    const dialogRef = this.dialog.open(ProfileDialog, {
      width: '800px'
    });
  }
}


@Component({
  selector: './profile-dialog',
  templateUrl: './profile-dialog.html'
})
export class ProfileDialog implements OnInit {
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();
  editForm2: FormGroup;
  editForm3: FormGroup;
  id;
  name;
  lastname;
  fullName;
  username;
  role;
  password;
  email;
  oldPassword='';
  newPassword;
  retypeNewPassword;
  user:any;
  tab;
  constructor(public dialogRef: MatDialogRef<ProfileDialog>,private dataservice:DataService,public validationService : ValidationService, public dialog: MatDialog, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  ngOnInit() {
    this.tab=0;
    this.oldPassword='';
    this.newPassword='';
    this.retypeNewPassword='';
    this.name='';
    this.lastname='';
    this.fullName='';
    this.username='';
    this.role='';
    this.email='';
    this.oldPassword='';
    this.newPassword='';
    this.retypeNewPassword='';
    this.editForm2 = this.formBuilder.group({
      name: [ this.name, Validators.required],
      lastname: [ this.lastname, Validators.required],
      username: [ this.username],
      role: [ this.role, Validators.required],
      email: [ this.email, Validators.required]
    });
    this.editForm3 = this.formBuilder.group({
        password: [ this.password,Validators.required ],
        oldPassword: [ this.oldPassword,Validators.required ],
        newPassword: [ this.newPassword,[Validators.required, Validators.minLength(8)] ],
        retypeNewPassword: [this.retypeNewPassword,Validators.required ],
      },
      {validator: [
          MustMatch('newPassword', 'retypeNewPassword'),
          MustMatch2('oldPassword', 'password')]}
    );
    function MustMatch(controlName: string, matchingControlName: string) {
      return (formGroup: FormGroup) => {
        var control = formGroup.controls[controlName];
        var matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          return;
        }
        if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
        } else {
          matchingControl.setErrors(null);
        }
      }
    }
    function MustMatch2(controlName: string, matchingControlName: string) {
      return (formGroup: FormGroup) => {
        var control = formGroup.controls[controlName];
        var matchingControl = formGroup.controls[matchingControlName];
        if (control.errors && !control.errors.mustMatch) {
          return;
        }
        if (control.value !== matchingControl.value) {
          control.setErrors({ mustMatch: true });
        } else {
          control.setErrors(null);
        }
      }
    }
    this.f2.role.disable();
    this.f2.email.disable();

    this.dataservice.getUsers({
      "userId":localStorage.getItem("id")
    }).subscribe(response=>{
      if(response.status=='ok'){
        this.id=response.data[0].id;
        this.name=response.data[0].name;
        this.lastname=response.data[0].lastname;
        this.fullName=response.data[0].fullName;
        this.username=response.data[0].username;
        this.role=response.data[0].role;
        this.password=response.data[0].password;
        this.email=response.data[0].email;
        this.editForm2.get("name").setValue(response.data[0].name);
        this.editForm2.get("lastname").setValue(response.data[0].lastname);
        this.editForm2.get("username").setValue(response.data[0].username);
        this.editForm2.get("email").setValue(response.data[0].email);
        this.editForm3.get("oldPassword").setValue(response.data[0].oldPassword);
        this.editForm3.get("newPassword").setValue(response.data[0].newPassword);
        this.editForm3.get("retypeNewPassword").setValue(response.data[0].retypeNewPassword);
        this.editForm3.get("password").setValue(response.data[0].password);
      }
    });
  }
  getUser(){
    this.dataservice.getUsers({
      "userId":localStorage.getItem("id")
    }).subscribe(response=>{
      if(response.status=='ok'){
        this.id=response.data[0].id;
        this.name=response.data[0].name;
        this.lastname=response.data[0].lastname;
        this.fullName=response.data[0].fullName;
        this.username=response.data[0].username;
        this.role=response.data[0].role;
        this.password=response.data[0].password;
        this.email=response.data[0].email;
      }
    });
  }
  tabChange(event){
    this.tab =event.index;
    this.editForm3.get("password").setValue(this.password);//bale ena settimoeout pou tha bazei timh edw meta apo ena deyterolepto
  }
  get f2() {
    return this.editForm2.controls;
  }
  get f3() {
    return this.editForm3.controls;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  public updateGeneralInfo() {
    if (this.editForm2.invalid) {
      this.validationService.validateAllFormFields(this.editForm2);
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});
      return;
    }
    this.dataservice.editUser({
      name: this.f2.name.value,
      lastname: this.f2.lastname.value,
      username: this.f2.username.value,
      userId:this.id
    }).subscribe(response=>{
      this.getUser();
      this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
      localStorage.setItem("fullName",response.fullName);
    });
  }
  disableInput(){
    if(this.newPassword==''){
      this.f2.newPassword.disable();
    }
  }
  public updatePassword() {
    if (this.editForm3.invalid) {
      this.validationService.validateAllFormFields(this.editForm3);
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});
      return;
    }
    this.dataservice.editUser({
      password: this.f3.newPassword.value,
      userId:this.id
    }).subscribe(response=>{
      this.getUser();
      this.retypeNewPassword='';
      this.oldPassword='';
      this.newPassword='';
      this.editForm3.markAsUntouched()
      this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
    });

  }
}

