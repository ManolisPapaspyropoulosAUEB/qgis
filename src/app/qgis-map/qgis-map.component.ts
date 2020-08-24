import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef, EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
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

import {img_ShadedreliefKhostUTM42n_0} from './data/shade';



import Autolinker from 'autolinker';
import {DataService} from '../../services/data.service';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {FacilitiesComponent} from '../facilities/facilities.component';
import {FilterService} from '../../services/filter.service';
import {DeleteVillageDialog, VillagesComponent} from '../villages/villages.component';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MatDrawer} from '@angular/material/sidenav';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ScrollService} from '../../services/scroll.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ExcelService} from '../services/excel.service';
import {ExcelPdfExporterService} from '../services/excel-pdf-exporter.service';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as ExcelProper from 'exceljs';
import * as FileSaver from 'file-saver';
import {CoreDataComponent} from '../core-data/core-data.component';
import {Router} from '@angular/router';
import {DatatableComponent} from '@swimlane/ngx-datatable';
import {VERSION} from '@angular/material/core';
import {NgxImageGalleryComponent, GALLERY_IMAGE, GALLERY_CONF} from 'ngx-image-gallery';
import {Gallery} from 'ng-gallery';
import {Image} from './image';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {ImagePipe} from './image.pipe';
import {SafeUrlPipe} from './safeurl.pipe';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {RemoteDataService} from '../../services/remotedata.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface Options {
  width?: number,
  height?: number,
  left?: number,
  top?: number,
  toolbar?: number,
  location?: number;
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
  public mcaActive;
  public rowHeight = 50;
  public pageLimit = 10;
  public currentBtnNavInit;
  public currentBtnNavCriteria;
  public currentBtnNavScores;
  public currentBtnNavMcaCbi;
  public currentBtnNav = '';
  public searchTextRoads: '';
  public searchTextFacilities: '';
  public searchTextVillages: '';
  public roadsToMap = [];
  //public lvrrid;
  public selectAllCheck;

  public orderCol;
  public descAsc;


  public flagMap;
  public asyncResult;
  public selectAllCheckFacilities;
  public showOnMapWidth;
  public roadWayRadio;
  public typeFacilities = this.filterService.facilitiesType;
  public villageNameFilter = this.filterService.villageNameFilter;
  public limitPage;
  public limitScroll;
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
  public districtsTabRoads = [];
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
  private sqlInFclass;
  private sqlInRoadConditions;
  public loading;
  public tab;
  public currentStatus;
  public currentStatusMapSelection;
  public selectAllCheckVillages;
  private roadsTab1Cpy = [];
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
  private changeModeArray=[];


  // this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5 this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7


  constructor(private  dataservice: DataService,
              domSanitizer: DomSanitizer,
              public router: Router,
              public filterService: FilterService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private scrollService: ScrollService,
              public excelPdfExporterService: ExcelPdfExporterService) {
  }

  // @ViewChild('mydatatable') mydatatable;
  @ViewChild('mydatatable') mydatatable: DatatableComponent;

  @ViewChild('fclassSelect') fclassSelect;
  @ViewChild('roadConditionSelect') roadConditionSelect;
  @ViewChild(FacilitiesComponent) facilitiesComponent: FacilitiesComponent;
  @ViewChild(VillagesComponent) villagesComponent: VillagesComponent;
  @ViewChild(CoreDataComponent) coreDataComponent: CoreDataComponent;
  @ViewChild('drawer') drawer: MatDrawer;
  @ViewChild('drawerMapSelections') drawerMapSelections: MatDrawer;
  @ViewChild('lvrrid') lvrrid;


  //
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

  workbook: ExcelProper.Workbook = new Excel.Workbook();//
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  private windowHandle: Window;
  private windowFeatures: Options = {width: 500, height: 500, left: 0, top: 0, location: 0};

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


  public ngOnInit() {
    this.loadingMap=false;
    this.loading = false;
    this.orderCol = 'LVRR_ID';
    this.descAsc = 'asc';
    this.shmaSort = 0;
    this.filterService.tab = 0;

    this.currentBtnNav = 'init';
    this.fullName = localStorage.getItem('fullName');
    if ((localStorage.getItem('province') != null) && (localStorage.getItem('district') != null)) {
      this.currentProvinceCode = localStorage.getItem('proCode');
      this.currentNum_district_code = localStorage.getItem('distCode');
      this.getRoadsPyParams();
    } else if (localStorage.getItem('province') != null) {
      this.currentProvinceCode = localStorage.getItem('proCode');
      this.getRoadsPyParams();
    } else {
      this.dataservice.getRoadsByParams({}).subscribe(response => {
        this.filterService.mapRoadsArrayAll = response.data;
      });
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

    this.currentLastParam = '';
    this.currentBtnNavInit = true;
    this.currentBtnNavCriteria = false;
    this.currentBtnNavScores = false;
    this.currentBtnNavMcaCbi = false;


  }


  public showCriteriaOrMca() {
    this.mcaActive = !this.mcaActive;
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


  btnControlNav(from) {


    var style;
    if (from == 1) {


      if (this.currentBtnNavInit) {
        style = {
          'margin-right': '4px!important',
          'border-radius': '16px!important',
          'height': '25px!important',
          'background': '#939BAC!important'
        };

      } else {

        style = {
          'margin-right': '4px!important',
          'border-radius': '16px!important',
          'height': '25px!important',
          'background': '#8BAA48!important'
        };


      }


      return style;
    } else if (from == 2) {
      if (this.currentBtnNavInit) {
        style = {
          'margin-right': '4px!important',
          'border-radius': '16px!important',
          'height': '25px!important',
          'background': '#939BAC!important'
        };
      } else {

        style = {
          'margin-right': '4px!important',
          'border-radius': '16px!important',
          'height': '25px!important',
          'background': '#8BAA48!important'
        };


      }

      return style;

    } else if (from == 3) {
      if (this.currentBtnNavInit) {
        style = {
          'margin-right': '4px!important',
          'border-radius': '16px!important',
          'height': '25px!important',
          'background': '#939BAC!important'
        };
      } else {

        style = {
          'margin-right': '4px!important',
          'border-radius': '16px!important',
          'height': '25px!important',
          'background': '#8BAA48!important'
        };


      }
      return style;


    } else if (from == 4) {
      if (this.currentBtnNavInit) {
        style = {
          'margin-right': '4px!important',
          'border-radius': '16px!important',
          'height': '25px!important',
          'background': '#939BAC!important'
        };
        return style;
      } else {

        style = {
          'margin-right': '4px!important',
          'border-radius': '16px!important',
          'height': '25px!important',
          'background': '#8BAA48!important'
        };


      }
      return style;

    }

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
      this.initMap(this.filterService, this.roadTab2, this.drawerMapSelections, this.currentStatusMapSelection);
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

  onClick(event) {//

  }

  public addRoadToMap(object, event) {
    if (event.checked == true) {
      var findRoad = this.roadsTab1.find(x => x.LVRR_ID == object.LVRR_ID);
      findRoad.checked = true;
      findRoad.checkedFilter = false;
      var clone = Object.create(findRoad);
      this.filterService.roadTab2.push(clone);
    } else {
      for (var i = 0; i < this.filterService.roadTab2.length; i++) {
        if (this.filterService.roadTab2[i].LVRR_ID == object.LVRR_ID) {
          this.filterService.roadTab2.splice(i, 1);
        }
      }
      var findRoad = this.roadsTab1.find(x => x.LVRR_ID == object.LVRR_ID);
      findRoad.checked = false;
      findRoad.checkedFilter = false;
    }
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
    var findRoad = this.roadsTab1.find(x => x.LVRR_ID == road.LVRR_ID);
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
    var findRoad = this.roadsTab1.find(x => x.LVRR_ID == road.LVRR_ID);
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


    var findRoad = this.roadsTab1.find(x => x.LVRR_ID == road.LVRR_ID);
    var findRoad2 = this.filterService.roadTab2.find(x => x.LVRR_ID == road.LVRR_ID);
    if (!findRoad.checkedFilter) {
      findRoad.checkedFilter = true;
      findRoad2.checkedFilter = true;
      road.checkedFilter = true;
    } else {
      findRoad.checkedFilter = false;
      findRoad2.checkedFilter = false;
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


//----------------------------------------------------------------------------------------------------------

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

  ngOnChanges2() {
    this.roadsTab1.forEach(e => {
      e.checked = false;
      e.checkedFilter = false;
    });
    if (this.filterService.roadTab2.length > 0 && this.roadsTab1.length > 0) {
      this.filterService.roadTab2.forEach(e => {
        var road = this.roadsTab1.find(x => x.LVRR_ID == e.LVRR_ID);
        road.checked = true;
        road.checkedFilter = e.checkedFilter;
      });
    }
  }

  public updateFilter() {
    this.getRoadsPyParams();
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
    if (this.selectAllCheck) {
      this.roadsTab1.forEach(element => {
        element.checked = false;
        this.filterService.roadTab2.splice(0, this.filterService.roadTab2.length);
        this.selectionArrayRoads.splice(0, this.selectionArrayRoads.length);
      });
    } else {
      this.roadsTab1.forEach(element => {
        element.checked = true;
        this.roadsToMap.push(element);
        element.checkedFilter = false;
        this.filterService.roadTab2.push(element);
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
    for (let i = 0; i < this.roadsTab1.length; i++) {
      var LVRR_ID = this.roadsTab1[i].LVRR_ID;
      var checked = this.roadsTab1[i].checked;
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
            layer.closePopup();
          }
        });
      }

      //----------------

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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
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
            layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
            layer.feature.geometry.type = 'MultiLineString';
            layer.closePopup();
          }
        });
      }
    }
  }


  public removeAllRoadsFromMap() {

    this.filterService.roadTab2 = [];
    this.roadsTab1 = [];


    if (this.currentNum_district_code == 1411) { //-->spera
      this.layer_Khost_Province_Spera_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    } else if (this.currentNum_district_code == 1406) {  //Nadir
      this.layer_Khost_Province_Nadir_Shah_Kot_District_OSM_roads_UTM42n_8.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });


    }


    else if (this.currentNum_district_code == 1403) { //gurbuz
      this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }

    //----------------

    else if (this.currentNum_district_code == 1410) {
      this.layer_Khost_Province_Qalandar_District_OSM_roads_UTM42n_9.eachLayer(function (layer) {

        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }

    else if (this.currentNum_district_code == 1402) {
      this.layer_Khost_Province_Manduzay_District_OSM_roads_UTM42n_6.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();

      });
    }

    else if (this.currentNum_district_code == 1412) {
      this.layer_Khost_Province_Shamul_District_OSM_roads_UTM42n_11.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }

    else if (this.currentNum_district_code == 1407) {
      this.json_Khost_Province_Sabari_District_OSM_roads_UTM42n_10.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }

    else if (this.currentNum_district_code == 1413) {
      this.layer_Khost_Province_Jaji_Maidan_District_OSM_roads_UTM42n_4.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();

      });
    }

    else if (this.currentNum_district_code == 1404) {
      this.layer_Khost_Province_Tanay_District_OSM_roads_UTM42n_13.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }

    else if (this.currentNum_district_code == 1408) {
      this.layer_Khost_Province_Tirzayee_District_OSM_roads_UTM42n_14.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }

    else if (this.currentNum_district_code == 1401) {
      this.layer_Khost_Province_Khost_District_OSM_roads_UTM42n_5.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
        layer.feature.geometry.type = 'MultiLineString';
        layer.closePopup();
      });
    }

    else if (this.currentNum_district_code == 1405) {
      this.layer_Khost_Province_Musa_Khel_District_OSM_roads_UTM42n_7.eachLayer(function (layer) {
        layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
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
      this.loadingMap=true;
      setTimeout(() => {
        this.coreDataComponent.emptyTable();
        this.ngOnChanges2();
        this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName); //mhn kaleseis thn get sou gia ta fereis ta facilities
        this.removeAllMarkersFromMap();//
        this.setRoadsToMap();
        this.addFacilitiesToMap();
        this.addVillagesToMap();
       // window.dispatchEvent(new Event('resize'));
        setTimeout(() => {
          this.loadingMap=false;
          },500
        );
      }, 500)
    } else if (tab == 1) {
      this.coreDataComponent.emptyTable();

      window.dispatchEvent(new Event('resize'));
      this.ngOnChanges2();
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);




      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (195) + 'px';
        }
      }, 200, false);



    } else if (tab == 2) {
      this.coreDataComponent.emptyTable();

      this.initMapRoadsArray();
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);

      // window.addEventListener('resize', function(event) {


      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (218) + 'px';
        }
      }, 0, false);
      // });

    } else if (tab == 3) {
      this.initMapRoadsArray();
      this.facilitiesComponent.setDistrict(this.currentNum_district_code, false, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.setDistrict(this.currentNum_district_code, true, this.currentProvinceCode, this.currentProvinceName, this.currentDistrictName);
      this.villagesComponent.enableNgx();
      this.coreDataComponent.emptyTable();
      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (218) + 'px';
        }
      }, 0, false);


    } else if (tab == 4) {
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

    console.log(e);

    var sqlIn = '(' + e.toString() + ')';
    this.sqlInFclass = sqlIn; ///
    this.getRoadsPyParams();
  }

  updateRoadConditionFilter(e) {

    console.log(e);

    var checks = [];
    checks = e;
    var sqlIn = '(' + e.toString() + ')';
    this.sqlInRoadConditions = sqlIn; ///
    this.getRoadsPyParams();
  }


  public selectRoad(road) {
  }


  public getRoadsPyParams() {
    this.loading = true;

    this.roadsTab1 = [];
    this.dataservice.getRoadsByParams(
      {
        'orderCol': this.orderCol,
        'descAsc': this.descAsc,
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
      this.loading = false;

      if (this.tab == 1) {
        setTimeout(function () {
          if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
            this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (195) + 'px';
          }
        }, 200, false);
      }


      this.roadsTab1.forEach(e => {
        e.checked = false;
        e.checkedFilter = false;
      });
      this.filterService.mapRoadsArrayAll = [];
      this.filterService.mapRoadsArrayAll = this.roadsTab1;
      this.filterService.roadTab2.forEach(e => {  //roadTab2
        var findRoad = this.roadsTab1.find(x => x.LVRR_ID == e.LVRR_ID);
        findRoad.checked = true;
        if (e.checkedFilter) {
          findRoad.checkedFilter = true;
        } else {
          findRoad.checkedFilter = false;
        }
      });


      if (this.shmaSort == 1) {
        setTimeout(() => {
          const className = this.__getElementByClass('datatable-body');
          className.scrollTo({
            top: 5,
            left: 5500
          });
          this.shmaSort = 0;
        }, 100);
      } else {
        setTimeout(() => {
          this.scrollService.scrollToElementById('top');
        }, 600);
      }
    });
  }

  onSort(event) {
    window.dispatchEvent(new Event('resize'));
    this.orderCol = event.column.prop;
    this.descAsc = event.newValue;
    this.shmaSort = 1;
    console.log(this.orderCol);
    if (this.orderCol == 'mca') {
      this.getRoadsPyParams();
    }
  }

  public calculateCriteriaRoad() {
    this.dataservice.calculateCriteria({
      'district_id': this.currentNum_district_code,
      'lvrr_id': this.currentNum_district_code
    }).subscribe(response => {
      if (response.status == 'ok') {
        this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
        this.getRoadsPyParams();
      } else {
        this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
      }
    });
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
    this.removeAllMarkersFromMap();
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
        layer.setStyle({fillColor: 'rgba(183,72,75,0.4470588235294118)'});
        layer.feature.geometry.type = 'MultiPolygonMode';
      });
    }else{
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        layer.setStyle({fillColor: 'rgba(183,72,75,1.0)'});
        layer.feature.geometry.type = 'MultiPolygon';
      });
    }


    this.highlightOnDistrictByName(district[0]);
    this.currentNum_district_code = district[0].num_district_code;
    this.currentDistrictName = district[0].district_name;
    this.getRoadsPyParams();
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

  ngAfterViewInit(): void {
    var message;
    this.selectionArrayRoads = [];
    this.diakopthsDromwn = true;
    this.roadsTab1 = [];
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
  }

  public selectAllCheckMethodFacilities() {
    this.facilitiesComponent.selectAllCheckMethod(this.selectAllCheckFacilities);
  }

  public selectAllCheckMethodVillages() {
    this.villagesComponent.selectAllCheckMethod(this.selectAllCheckVillages);
  }

  private __getElementByClass(className: string): HTMLElement {
    console.log('element class : ', className);
    const element = <HTMLElement>document.querySelector(`.${className}`);
    return element;
  }//datatable-body


  public changeMode(){
      if(this.changeModeArray.length>0){
      this.changeModeArray.forEach(element => {
        this.myMap.removeLayer(element);
      });
      this.changeModeArray=[];
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        layer.setStyle({fillColor: 'rgba(183,72,75,1.0)'});
        layer.feature.geometry.type = 'MultiPolygon';
      });

      if(localStorage.getItem('district') != null){//ara uparxei epilegmeno district
        var currentDistrict = this.currentDistrictName;
        this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
          if (layer.feature.properties.dist_name_ == currentDistrict) {
            layer.setStyle({fillColor: '#ffff00'});
            layer.feature.geometry.type = 'editRow';
          }
        });
      }


    }else{
      var bounds_group = new L.featureGroup([]);
      this.myMap.createPane('pane_ShadedreliefKhostUTM42n_0');//
      this.myMap.getPane('pane_ShadedreliefKhostUTM42n_0').style.zIndex = 400;
      var img_ShadedreliefKhostUTM42n_0 = 'http://192.168.1.5:9023/downloadFile?docId=133';
      var img_bounds_ShadedreliefKhostUTM42n_0 = [[32.84103911135089,69.0882851687274],[33.9123098127972,70.5131406575886]];
      var layer_ShadedreliefKhostUTM42n_0 = new L.imageOverlay(img_ShadedreliefKhostUTM42n_0,
        img_bounds_ShadedreliefKhostUTM42n_0,
        {pane: 'pane_ShadedreliefKhostUTM42n_0'});
      bounds_group.addLayer(layer_ShadedreliefKhostUTM42n_0);
      this.myMap.addLayer(layer_ShadedreliefKhostUTM42n_0);
      this.changeModeArray.push(layer_ShadedreliefKhostUTM42n_0);
      this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
        layer.setStyle({fillColor: 'rgba(183,72,75,0.4470588235294118)'});
        layer.feature.geometry.type = 'MultiPolygonMode';
      });

      if(localStorage.getItem('district') != null){//ara uparxei epilegmeno district
        var currentDistrict = this.currentDistrictName;
        this.layer_KhostProvincedistrictsKhost_Province_UTM42n_1.eachLayer(function (layer) {
          if (layer.feature.properties.dist_name_ == currentDistrict) {
            layer.setStyle({fillColor: '#fff0488f'});
            layer.feature.geometry.type = 'editRow';
          }
        });
      }


    }



  }


  private initMap(filterService, roadTab2, drawerMapSelections, currentStatusMapSelection): void {

  function __getElementByClassF(className: string): HTMLElement {
      console.log('element class : ', className);
      const element = <HTMLElement>document.querySelector(`.${className}`);
      return element;
    }


    $(window).resize(function () {
      if (filterService.tab == 1) {
        this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (195) + 'px';

      } else if (filterService.tab == 2) {
        this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (218) + 'px';

      } else if (filterService.tab == 3) {
        this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (218) + 'px';

      } else if (filterService.tab == 4) {
        this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (199) + 'px';
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
      if (e.target.feature.geometry.type == 'MultiLineString') {
        filterService.countHits = filterService.countHits + 1;
        if (filterService.countHits == 1) {
          drawerMapSelections.toggle().finally(() => {
            window.dispatchEvent(new Event('resize'));
          });
          currentStatusMapSelection = !currentStatusMapSelection;
        }
        var findRoadForGetMethod = filterService.mapRoadsArrayAll.find(x => x.LVRR_ID == e.target.feature.properties.LVRR_ID);
        findRoadForGetMethod.checkedFilter = false;
        filterService.roadTab2.push(findRoadForGetMethod);
        e.target.feature.geometry.type = 'editMapRoad';
        highlightLayer.setStyle(
          {color: '#009111', weight: 8}
        );
      } else if (e.target.feature.geometry.type == 'editMapRoad') {  //editMapRoadSelection
        e.target.feature.geometry.type = 'MultiLineString';
        highlightLayer.setStyle(
          {color: '#00ff17', weight: 8}
        );
        for (var i = 0; i < filterService.roadTab2.length; i++) {
          if (filterService.roadTab2[i].LVRR_ID == e.target.feature.properties.LVRR_ID) {
            filterService.roadTab2.splice(i, 1);
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
          e.target._eventParents[i].resetStyle(e.target);
        }
      }else if(e.target.feature.geometry.type === 'MultiPolygonMode'){
        e.target.setStyle({fillColor: 'rgba(183,72,75,0.4470588235294118)'});
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
      layer.bindPopup(popupContent, {maxHeight: 400, minHeight: 400, maxWidth: 300, minWidth: 196, closeOnClick: false, autoClose: true});
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
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (218) + 'px';
        }
      }, 600, false);

    } else if (this.filterService.tab == 3) {

      setTimeout(function () {
        if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
          this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (218) + 'px';
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
      width: '800px',
      data: item
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.updateRoad(result).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 2000});
            this.dataservice.calculateCriteria({
              'district_id': this.currentNum_district_code,
              'lvrr_id': response.lvrr_id
            }).subscribe(response => {
              if (response.status == 'ok') {
                setTimeout(() => {
                  this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 2000});
                }, 2000);

                this.getRoadsPyParams();
              } else {
                this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
              }
            });
          } else {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        });
      }
    });
  }


  photoGalley(item) {
    const dialogRef = this.dialog.open(PhotoGallery, {
      data: item,
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
    const dialogRef = this.dialog.open(NotesDialog, {
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


  public calculateCriteria() {
    const dialogRef = this.dialog.open(CriteriaConfirmationDialog, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.calculateCriteria({
          'district_id': this.currentNum_district_code,
          'snapshot': result.snapshot
        }).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            this.getRoadsPyParams();
          } else {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        });
      }
    });
  }


  public convertAs() {
    const dialogRef = this.dialog.open(OpenPdfConfigurationDialog, {
      width: '800px',
      data: {
        'from': 'exportButton'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.exporter == 'XLSX') {
          if (result.optionExporter == 'selected') {
            this.excelPdfExporterService.convertAsPdf(this.filterService.roadTab2);
          } else if (result.optionExporter == 'all' || result.optionExporter == '5' || result.optionExporter == '10' || result.optionExporter == '20' || result.optionExporter == '30' || result.optionExporter == '50') {
            this.dataservice.getRoadsForExporter(
              {
                'orderCol': this.orderCol,
                'result': result.optionExporter,
                'descAsc': this.descAsc,
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
              this.excelPdfExporterService.convertAsXls(response.data);
            });
          }
        } else if (result.exporter == 'PDF') {
          if (result.optionExporter == 'selected') {
            this.excelPdfExporterService.convertAsPdf(this.filterService.roadTab2);
          } else if (result.optionExporter == 'all' || result.optionExporter == '5' || result.optionExporter == '10' || result.optionExporter == '20' || result.optionExporter == '30' || result.optionExporter == '50') {
            this.dataservice.getRoadsForExporter(
              {
                'orderCol': this.orderCol,
                'result': result.optionExporter,
                'descAsc': this.descAsc,
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
              this.excelPdfExporterService.convertAsPdf(response.data);
            });
          }
        }
      }
    });
  }

  public convertAsXls() {
    const dialogRef = this.dialog.open(OpenPdfConfigurationDialog, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result == 'selected') {
          this.excelPdfExporterService.convertAsXls(this.filterService.roadTab2);
        } else if (result == 'all' || result == '5' || result == '10' || result == '20' || result == '30' || result == '50') {
          let expObject = {
            'orderCol': this.orderCol,
            'descAsc': this.descAsc
          };
          this.dataservice.getRoadsForExporter(
            {
              'orderCol': this.orderCol,
              'result': result,
              'descAsc': this.descAsc,
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
            this.excelPdfExporterService.convertAsXls(response.data);
          });
        }
      }
    });
  }

  snapshotDialog() {
    const dialogRef = this.dialog.open(HistoryDialog, {
      width: '800px',
    });
  }

  public importRoadsXLS() {
    const dialogRef = this.dialog.open(ImportDialog, {
      width: '1300px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading=true;
        this.dataservice.importRoadsData(result).subscribe(response=>{
          if(response.status=='ok'){
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            this.getRoadsPyParams();
          }else{
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        })
      }
    });
  }
}


type AOA = any[][];
import * as XLSX from 'xlsx';
import {Error} from 'tslint/lib/error';
import {promise} from 'selenium-webdriver';
import Promise = promise.Promise;
@Component({
  selector: './import-dialog',
  templateUrl: './import-dialog.html'
})
export class ImportDialog implements OnInit {
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();
  name = 'Angular';
  fileName: string = 'SheetJS.xlsx';
  data: any;
  totalErrorDublicate = 0;
  flagMissingMatchHeaders;
  public criteriaCheckBox;
  public loading;


  public headData = []; // excel row header
  public headData2 = []; // excel row header
  constructor(public dialogRef: MatDialogRef<ImportDialog>, public dialog: MatDialog, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public item: any
  ) {
  }

  public dublicateHeaders = [];
  public headersDB = [];
  ngOnInit() {
    this.criteriaCheckBox=false;
    this.loading=false;
    this.headersDB=[
      {'title': 'osmId','titleJava':'osmId'},
      {'title': 'code','titleJava':'code'},
      {'title': 'fclass','titleJava':'fclass'},
      {'title': 'name','titleJava':'name'},
      {'title': 'ref','titleJava':'ref'},
      {'title': 'oneway','titleJava':'oneway'},
      {'title': 'maxspeed','titleJava':'maxspeed'},
      {'title': 'bridge','titleJava':'bridge'},
      {'title': 'tunnel','titleJava':'tunnel'},
      {'title': 'layer','titleJava':'layer'},
      {'title': 'farmToTheMarket','titleJava':'farmToTheMarket'},
      {'title': 'accessToGCsRMs','titleJava':'accessToGCsRMs'},
      {'title': 'agriculturalFacilities','titleJava':'agriculturalFacilities'},
      {'title': 'district','titleJava':'district'},
      {'title': 'source','titleJava':'source'},
      {'title': 'lvrrId','titleJava':'lvrrId'},
      {'title': 'lengthInMetres','titleJava':'lengthInMetres'},
      {'title': 'widthInMetres','titleJava':'widthInMetres'},
      {'title': 'elevationInMetres','titleJava':'elevationInMetres'},
      {'title': 'populationServed','titleJava':'populationServed'},
      {'title': 'facilitiesServed','titleJava':'facilitiesServed'},
      {'title': 'linksToMajorActivityCentres','titleJava':'linksToMajorActivityCentres'},
      {'title': 'numberOfConnections','titleJava':'numberOfConnections'},
      {'title': 'roadCondition','titleJava':'roadCondition'}
    ];
    this.totalErrorDublicate = 0;
    this.flagMissingMatchHeaders=false;
  }
  public importRoads() {
    this.flagMissingMatchHeaders=false;
    this.headData2.forEach(e => {
        e.flag = false;
      }
    );
    this.headData2.forEach(e => {
      this.headersDB.forEach(edb => {
        if (edb.title == e.title) {
            e.flag=true;
        }
      });
    });
    this.headData2.forEach(e => {
      if(e.flag==false){
        this.flagMissingMatchHeaders=true;
        return;
      }
    });
    let resObject = {
      "headers":this.headData2,
      "data":this.data,
      "length":this.headData2.length,
      "criteriaCheckBox":this.criteriaCheckBox
    };
    this.dialogRef.close(resObject);
  }
  public dublicateErrorMessage() {
    var c = 0;
    for (var i = 0; i < this.headData2.length; i++) {
      if (this.headData2[i].dublicateErrorFlag) {
        c++;
      }
    }
    this.totalErrorDublicate = c;
    if (c > 1) {
      return {};
    } else {
      return {
        display: 'none',
      };
    }
  }
  public dublicateError(headCol, index): Object {
    var headCount = 0;
    this.headData2.forEach(e => {
      if (e.title == headCol.title) {
        headCount++;
      }
    });
    if (headCount > 1) {
      this.headData2[index].dublicateErrorFlag = true;
      return {
        border: '1px solid red',
      };
    } else {
      this.headData2[index].dublicateErrorFlag = false;
    }
    return {};
  }
  testH(e) {
    console.log(e);
  }
  onFileChangeUpload(evt: any) {
    this.loading=true;
    this.totalErrorDublicate = 0;
    this.flagMissingMatchHeaders=false;
    this.data=[];
    this.headData2=[];
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1, raw: false, range: 0}));
      this.loading=false;
      this.headData = this.data[0];
      this.data[0].forEach(e => {
        this.headData2.push({
          'title': e,
          'dublicateErrorFlag': false
        });
      });
      this.data = this.data.slice(1); // remove first header record
      const ws2: XLSX.WorkSheet = wb.Sheets[wb.SheetNames[1]];
      this.readDataSheet(ws2, 0);
      this.headData2.forEach(e => {
          e.flag = false;
        }
      );
      this.headData2.forEach(e => {
        this.headersDB.forEach(edb => {
          if (edb.title == e.title) {
            e.flag=true;
          }
        });
      });
      this.headData2.forEach(e => {
        if(e.flag==false){
          this.flagMissingMatchHeaders=true;
        }
      })
    };
    reader.readAsBinaryString(target.files[0]);
  }
  public selectHeader (header){
    var k=0;
    header.flag=true;
    this.headData2.forEach(e => {
      if(header.title==e.title){
        header.flag=true;
      }
    });
    this.headData2.forEach(e => {
      if(e.flag==false){
        k++;
      }
    });
    if(k==0){
      this.flagMissingMatchHeaders=false;
    }
  }
  private readDataSheet(ws: XLSX.WorkSheet, startRow: number) {
    let datas = <AOA>(XLSX.utils.sheet_to_json(ws, {header: 1, raw: false, range: startRow}));
    console.log(datas[1]);
    let headDatas = datas[0];
    for (let i = 0; i < this.data.length; i++) {
      this.data[i][this.headData.length] = datas.filter(x => x[0] == this.data[i][0]);
    }
  }

  export(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public yes() {
    this.dialogRef.close(true);
  }
}

@Component({
  selector: './history-dialog',
  templateUrl: './history-dialog.html'
})
export class HistoryDialog implements OnInit {
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();
  snapshots = [];

  constructor(public dialogRef: MatDialogRef<HistoryDialog>, public excelPdfExporterService: ExcelPdfExporterService, public dialog: MatDialog, private  dataservice: DataService, private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  ngOnInit() {
    // this.notes=this.data.notes;
    this.getAllSnapshotsRecords();
  }
  onDismiss(event) {
    this.dismiss.emit(event);
  }

  onFocusOut(event) {
    this.focusout.emit(event);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  public yes() {
    this.dialogRef.close(true);
  }

  getAllSnapshotsRecords() {
    this.dataservice.getAllSnapshotsRecords({}).subscribe(response => {
      if (response.status == 'ok') {
        this.snapshots = response.data;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 400);
      }
    });
  }


  public exportAs(row) {
    row.from = 'history';
    const dialogRef = this.dialog.open(OpenPdfConfigurationDialog, {
      width: '800px',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let finalRes = {
          'exporter': result.exporter,
          'id': row.id
        };
        if (finalRes.exporter == 'PDF') {
          //getAllFromRoadsHistory
          this.dataservice.getAllFromRoadsHistory(finalRes).subscribe(response => {
            this.excelPdfExporterService.convertAsPdf(response.data);
          });
        } else if (finalRes.exporter == 'XLS') {
          this.dataservice.getAllFromRoadsHistory(finalRes).subscribe(response => {
            this.excelPdfExporterService.convertAsXls(response.data);
          });
        }
      }
    });
  }


  deleteSnapshot(snapshot) {//
    const dialogRef = this.dialog.open(DeleteSnapshotDialog, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.deleteSnapshot(snapshot).subscribe(response => {
          this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          this.getAllSnapshotsRecords();
        });
      }
    });
  }
}


@Component({
  selector: './delete-snapshot-dialog',
  templateUrl: './delete-snapshot-dialog.html'
})
export class DeleteSnapshotDialog implements OnInit {
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<DeleteSnapshotDialog>, public dialog: MatDialog, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  public yes() {
    this.dialogRef.close(true);
  }
}


@Component({
  selector: './config-pdf-dialog',
  templateUrl: './config-pdf-dialog.html'
})
export class OpenPdfConfigurationDialog implements OnInit {
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();

  optionExporter;
  exporter;
  constructor(public dialogRef: MatDialogRef<OpenPdfConfigurationDialog>, public dialog: MatDialog, private  dataservice: DataService, private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
    this.optionExporter = 'all';
    this.exporter = 'PDF';
  }

  onFocusOut(event) {
    this.focusout.emit(event);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  public yes() {

    let obres = {
      'optionExporter': this.optionExporter,
      'exporter': this.exporter,
    };

    this.dialogRef.close(obres);
  }


  public save() {
  }


}


@Component({
  selector: './confirmation criteria-dialog',
  templateUrl: './confirmation criteria-dialog.html'
})
export class CriteriaConfirmationDialog implements OnInit {
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();
  public snapshotCheck;
  constructor(public dialogRef: MatDialogRef<CriteriaConfirmationDialog>, public dialog: MatDialog, private  dataservice: DataService, private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }


  ngOnInit() {
    this.snapshotCheck = true;
  }

  onFocusOut(event) {
    this.focusout.emit(event);
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  public yes() {
    let resutlt = {
      'snapshot': this.snapshotCheck
    };
    this.dialogRef.close(resutlt);
  }
  public save() {
  }
}


@Component({
  selector: './notes-dialog',
  templateUrl: './notes-dialog.html'
})
export class NotesDialog implements OnInit {
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();
  notes = [];

  constructor(public dialogRef: MatDialogRef<NotesDialog>, public dialog: MatDialog, private  dataservice: DataService, private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
    this.getNoteByRoadId();
  }


  onDismiss(event) {
    this.dismiss.emit(event);
  }

  onFocusOut(event) {
    this.focusout.emit(event);
  }

  editNote(note) {
    note.updateMode = 1;
    const dialogRef = this.dialog.open(AddingNoteDialog, {
      width: '800px',
      data: note
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.editNote(result).subscribe(response => {
          this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          this.getNoteByRoadId();
        });

      }
    });

  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  public yes() {
    this.dialogRef.close(true);
  }

  getNoteByRoadId() {
    this.dataservice.getNoteByRoadId({'roadId': this.data.id}).subscribe(response => {
      if (response.status == 'ok') {
        this.notes = response.data;
        setTimeout(() => {
          window.dispatchEvent(new Event('resize'));
        }, 400);
      }
    });
  }

  addNote() {
    this.data.updateMode = 0;
    const dialogRef = this.dialog.open(AddingNoteDialog, {
      width: '800px',
      data: this.data


    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.addNote(result).subscribe(response => {
          this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          this.getNoteByRoadId();
        });
      }
    });


  }


  public save() {

  }


  deleteNote(note) {
    note.updateMode = 1;
    const dialogRef = this.dialog.open(DeleteNoteDialog, {
      width: '800px',
      data: note
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.deleteNote(note).subscribe(response => {
          this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          this.getNoteByRoadId();
        });

      }
    });

  }


}


@Component({
  selector: './delete-note-dialog',
  templateUrl: './delete-note-dialog.html'
})
export class DeleteNoteDialog implements OnInit {
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<AddingNoteDialog>, public dialog: MatDialog, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }


  ngOnInit() {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  public yes() {
    this.dialogRef.close(true);

  }


}


@Component({
  selector: './add-note-dialog',
  templateUrl: './add-note-dialog.html'
})
export class AddingNoteDialog implements OnInit {
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<AddingNoteDialog>, public dialog: MatDialog, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  editForm2: FormGroup;
  title;
  description;
  ngOnInit() {

    if (this.data.updateMode == 1) {
      this.title = this.data.title;
      this.description = this.data.description;
    } else {
      this.title = '';
      this.description = '';
    }
    this.editForm2 = this.formBuilder.group({
      title: [this.title, Validators.required],
      description: [this.description, Validators.required],


    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public yes() {
    this.dialogRef.close(true);

  }


  get f() {
    return this.editForm2.controls;
  }


  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }


  public saveNote() {

    if (this.editForm2.invalid) {
      this.validateAllFormFields(this.editForm2);
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});

      return;

    }

    if (this.data.updateMode == 0) {

      let resultObject = {
        title: this.f.title.value,
        description: this.f.description.value,
        roadId: this.data.id
      };
      this.dialogRef.close(resultObject);

    } else {

      let resultObject = {
        title: this.f.title.value,
        description: this.f.description.value,
        roadId: this.data.roadId,
        id: this.data.id
      };
      this.dialogRef.close(resultObject);
    }
  }
}


@Component({
  selector: './photo-gallery-road',
  templateUrl: './photo-gallery-road.html',
  styleUrls: ['./photo-gallery-road.css']

})

export class PhotoGallery implements OnInit {
  base64File: string = null;
  version = VERSION;
  imgObjHttp;
  imageData = [];
  public loading: boolean;
  public searchTextImages: '';

  //  SERVER_URL = "http://localhost:9023/uploadFile";
  SERVER_URL = this.remoteDataService.serviceURL + 'uploadFile';
  uploadForm: FormGroup;
  file = '';
  @ViewChild(MaterialFileInputModule) fileInput: MaterialFileInputModule;
  constructor(public dialogRef: MatDialogRef<EditRoadDialog>, public remoteDataService: RemoteDataService, public gallery: Gallery, public domSanitizer: DomSanitizer, public dialog: MatDialog, safeUrl: SafeUrlPipe, private sanitizer: DomSanitizer,
              @Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient,
              private dataService: DataService, private snackBar: MatSnackBar, public router: Router, private formBuilder: FormBuilder, private httpClient: HttpClient
  ) {
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('file').setValue(file);

    }
  }

  ngOnInit() {
    this.loading = false;
    this.uploadForm = this.formBuilder.group({
      file: ['']
    });
    this.getImages();
  }

  public getImages() {
    this.imageData = [];
    this.dataService.getPhotoByRoadId(this.data).subscribe(response => {
      response.data.forEach(e => {
        e.imageFetchHttp = this.remoteDataService.imageURL + '?docId=' + e.id;
        this.imageData.push(e);
      });
    });
  }
  downloadDocument(img) {  //https://www.npmjs.com/package/file-saver
    let headers = new Headers();
    let params1: HttpParams;
    params1 = new HttpParams().set('id', img.id);
    this.http.get(this.remoteDataService.serviceURL + 'downloadDocument', {
      withCredentials: true,
      responseType: 'blob',
      params: params1
    }).subscribe(r => {
      var blob = r;
      FileSaver.saveAs(blob, img.originalName);
    });
  }
  deletePhoto(img) {
    const dialogRef = this.dialog.open(DeleteImgDialog, {
      width: '600px',
      maxHeight: '750px',
      data: img.id
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteImage(img).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            this.getImages();
          } else {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        });
      }

    });
  }

  get f() {
    return this.uploadForm.controls;
  }

  private __getElementByClass(className: string): HTMLElement {
    const element = <HTMLElement>document.querySelector(`.${className}`);
    return element;
  }

  onSubmit() {
    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('file').value);
    formData.append('district', this.data.district);
    formData.append('districtId', this.data.districtId);
    formData.append('roadId', this.data.id);
    formData.append('replace', '');
    this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
      (res) => {
        if (res.status == 'ok') {
          $('#uploadBtn2').val('');
          this.uploadForm.get('file').setValue('');
          this.getImages();
          this.snackBar.open(res.message, 'x', <MatSnackBarConfig>{duration: 4000});
          this.loading = false;
        } else if (res.status == 'warning') {
          this.uploadForm.get('file').setValue('');
          this.loading = false;
          const dialogRef = this.dialog.open(ConfirmUploadPhotoDialog, {
            width: '800px'
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              formData.delete('replace');
              formData.append('replace', 'yes');

              this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
                (res) => {
                  if (res.status == 'ok') {
                    $('#uploadBtn2').val('');

                    this.getImages();
                    this.snackBar.open(res.message, 'x', <MatSnackBarConfig>{duration: 4000});
                  } else {
                    this.snackBar.open(res.message, 'x', <MatSnackBarConfig>{duration: 4000});
                  }
                },
                (err) => console.log(err)
              );
            }
          });
        } else {
          this.loading = false;
          this.uploadForm.get('file').setValue('');
          this.snackBar.open(res.message, 'x', <MatSnackBarConfig>{duration: 4000});
        }
        this.loading = false;

      },
      (err) => {

        this.loading = false;
        this.snackBar.open('Max length limit attained', 'x', <MatSnackBarConfig>{duration: 4000});
        $('#uploadBtn2').val('');
        this.uploadForm.get('file').setValue('');
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


@Component({
  selector: './confirmation_replace-img-dialog',
  templateUrl: './confirmation_replace-img-dialog.html'
})
export class ConfirmUploadPhotoDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteImgDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  public yes() {
    this.dialogRef.close(true);

  }
}


@Component({
  selector: './delete-img-dialog',
  templateUrl: './delete-img-dialog.html'
})
export class DeleteImgDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteImgDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit() {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  public yes() {
    this.dialogRef.close(true);

  }
}


@Component({
  selector: './edit-road-dialog',
  templateUrl: './edit-road-dialog.html'
})
export class EditRoadDialog implements OnInit {
  editForm: FormGroup;
  name;
  fclass;
  ref;
  oneway;
  maxspeed: number = 0;
  layer: number = 0;
  bridgeMat: boolean;
  tunnelMat: boolean;
  source;
  lengthInMetres;
  elevationInMetres;
  lvrr_id;
  populationServed;
  facilitiesServed;
  accessToGCsRMs;
  farmToTheMarket;
  ftm;
  agricultureFacilitaties;
  linksToMajorActivityCentres;
  numberOfConnections;
  roadCondition;
  connectivity;

  constructor(public dialogRef: MatDialogRef<EditRoadDialog>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private snackBar: MatSnackBar, public router: Router,
  ) {
  }

  ngOnInit() {
    this.ftm = -1;
    this.name = this.data.name;
    this.ref = this.data.ref;
    this.oneway = this.data.oneway;
    this.lvrr_id = this.data.LVRR_ID;
    this.connectivity = this.data.connectivity;
    this.fclass = this.data.fclass;
    this.ref = this.data.ref;
    this.oneway = this.data.oneway;
    this.maxspeed = this.data.maxspeed;
    this.layer = this.data.layer;
    this.bridgeMat = this.data.bridgeMat;
    this.tunnelMat = this.data.tunnelMat;
    this.source = this.data.source;
    this.lengthInMetres = this.data.lengthInMetres;
    this.elevationInMetres = this.data.elevationInMetres;
    this.populationServed = this.data.populationServed;
    this.facilitiesServed = this.data.facilitiesServed;
    this.accessToGCsRMs = this.data.accessToGCsRMs;
    this.farmToTheMarket = this.data.farmToTheMarket;
    this.agricultureFacilitaties = this.data.agricultureFacilitaties;
    this.linksToMajorActivityCentres = this.data.facilitiesServed + this.data.accessToGCsRMs;
    this.numberOfConnections = this.data.numberOfConnections;
    this.roadCondition = this.data.roadCondition;
    this.editForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      fclass: [this.fclass, Validators.required],
      ref: [this.ref],
      oneway: [this.oneway],
      maxspeed: [this.maxspeed, Validators.min(0)],
      layer: [this.layer, Validators.min(0)],
      bridgeMat: [this.bridgeMat],
      tunnelMat: [this.tunnelMat],
      source: [this.source],
      lengthInMetres: [this.lengthInMetres, Validators.min(0)],
      elevationInMetres: [this.elevationInMetres, Validators.min(0)],
      populationServed: [this.populationServed, Validators.min(0)],
      facilitiesServed: [this.facilitiesServed, Validators.min(0)],
      accessToGCsRMs: [this.accessToGCsRMs, [Validators.min(5), Validators.max(10)]],
      connectivity: [this.connectivity, Validators.min(0)],
      farmToTheMarket: [this.farmToTheMarket],
      agricultureFacilitaties: [this.agricultureFacilitaties],
      linksToMajorActivityCentres: [this.linksToMajorActivityCentres],
      numberOfConnections: [this.numberOfConnections, [Validators.min(0), Validators.max(10)]],
      roadCondition: [this.roadCondition]
    });
    this.f.linksToMajorActivityCentres.disable();
  }


  get f() {
    return this.editForm.controls;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  ftthemarket(value) {
  }

  public save() {
    if (this.editForm.invalid) {
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});
      this.validateAllFormFields(this.editForm);
      return;
    }
    let resultObject = {
      name: this.f.name.value,
      fclass: this.f.fclass.value,
      ref: this.f.ref.value,
      oneway: this.f.oneway.value,
      maxspeed: this.f.maxspeed.value,
      layer: this.f.layer.value,
      bridgeMat: this.f.bridgeMat.value,
      tunnelMat: this.f.tunnelMat.value,
      connectivity: this.f.connectivity.value,
      source: this.source,
      farmToTheMarket: this.farmToTheMarket,
      lengthInMetres: this.f.lengthInMetres.value,
      elevationInMetres: this.f.elevationInMetres.value,
      populationServed: this.f.populationServed.value,
      facilitiesServed: this.f.facilitiesServed.value,
      accessToGCsRMs: this.f.accessToGCsRMs.value,
      agricultureFacilitaties: this.agricultureFacilitaties,
      linksToMajorActivityCentres: this.f.linksToMajorActivityCentres.value,
      numberOfConnections: this.f.numberOfConnections.value,
      roadCondition: this.f.roadCondition.value,
      id: this.data.id
    };
    this.dialogRef.close(resultObject);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

