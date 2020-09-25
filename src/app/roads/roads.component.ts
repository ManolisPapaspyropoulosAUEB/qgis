import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {ScrollService} from '../../services/scroll.service';
import {DataService} from '../../services/data.service';
import {FilterService} from '../../services/filter.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ExcelPdfExporterService} from '../services/excel-pdf-exporter.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
type AOA = any[][];
import * as XLSX from 'xlsx';
import * as $ from 'jquery';
import * as FileSaver from 'file-saver';

import {Error} from 'tslint/lib/error';
import {VERSION} from '@angular/material/core';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {RemoteDataService} from '../../services/remotedata.service';
import {Gallery} from 'ng-gallery';
import {DomSanitizer} from '@angular/platform-browser';
import {SafeUrlPipe} from '../qgis-map/safeurl.pipe';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {ValidationService} from '../../services/validation.service';
import {QgisMapComponent} from '../qgis-map/qgis-map.component';
@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.css']
})
export class RoadsComponent implements OnInit {

  roadsTab1=[];
  limitPage;
  public rowHeight = 50;
  public loading;
  public loadingMap;
  public orderCol;
  public descAsc;
  public currentBtnNavInit;
  public currentBtnNavCriteria;
  public currentBtnNavScores;
  public currentBtnNavMcaCbi;
  public currentBtnNav = '';
  public currentLastParam = '';
  public nameFilter;
  public currentNum_district_code: any;
  public sqlInFclass;
  public sqlInRoadConditions;
  public roadWayRadio;
  public bridgeFilter;
  public maxSpeedFilter;
  public agriculturFacilitationFilter;
  public districtChange;
  public tab;
  public shmaSort;
  public showAllCheckRoads;
  public roadsTab1FalseAllCheck = [];
  constructor( private scrollService: ScrollService,
               private dataservice: DataService,
               private filterService :FilterService,
               public dialog: MatDialog,
               private snackBar: MatSnackBar,
               public excelPdfExporterService: ExcelPdfExporterService
  ) { }
  ngOnInit(): void {
    this.currentBtnNavInit = true;
    this.showAllCheckRoads=false;
    this.shmaSort = 0;
    this.currentLastParam = '';
    this.districtChange=true;
    this.loadingMap=false;
    this.loading = false;
    this.nameFilter = '';
    this.orderCol = 'LVRR_ID';
    this.descAsc = 'asc';
    this.sqlInFclass = '()';
    this.sqlInRoadConditions = '()';
    this.roadWayRadio = 'FB';
    this.bridgeFilter = 'TF';
    this.agriculturFacilitationFilter = 'TF';
    this.tab=this.filterService.tab;
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
  public getRoadsPyParams() {
    console.log(this.nameFilter);
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
      if(this.filterService.mapRoadsArrayAll.length==0 || this.districtChange){
        this.filterService.mapRoadsArrayAll=[];
        this.filterService.mapRoadsArrayAll= response.data;
        this.districtChange=false;
        this.showAllCheckRoads=false;
        setTimeout(() => {
          this.filterService.loadingMap=false;
        }, 600);
      }
      this.roadsTab1 = response.data;
      this.roadsTab1.forEach(e => {
        if(e.bridge=="F"){
          e.bridge=false;
        }else{
          e.bridge=true;

        }
        if(e.tunnel=="F"){
          e.tunnel=false;
        }else{
          e.tunnel=true;
        }
        e.LVRR_ID =  e.lvrrId;
        e.osm_id =  e.osmId;
        e.accessToGCsRMs =  e.c3Id;
        e.farmToTheMarket =  e.c4Id;
        e.agricultureFacilitation =  e.c5Id;
        e.roadAccessibility =  e.c7Id;
        e.numberOfConnections =  e.c8Id;
        e.roadConditionCriterio =  e.c9Id;
        e.roadQualityAndNeeds =  e.c10Id;
        e.requirementsForEarthWorks =  e.c11Id;
        e.trafficVolume =  e.c12Id;
        e.safety =  e.c13Id;
        e.security =  e.c14Id;
        e.environmentalImpacts =  e.c15Id;
      });
      if (this.tab == 1) {
        setTimeout(function () {
          if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
            this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (195) + 'px';
          }
        }, 200, false);
      }
      this.filterService.roadTab2.forEach(e => {  //roadTab2  //this.filterService.mapRoadsArrayAll // this.roadsTab1
        var findRoadAll = this.filterService.mapRoadsArrayAll.find(x => x.LVRR_ID == e.LVRR_ID);
        findRoadAll.checked = true;
        findRoadAll.checkedFilter = e.checkedFilter;
        var findRoad = this.roadsTab1.find(x => x.LVRR_ID == e.LVRR_ID);
        if(findRoad!=undefined){
          findRoad.checked = true;
          if (e.checkedFilter) {
            findRoad.checkedFilter = true;
          } else {
            findRoad.checkedFilter = false;
          }
        }
      });
      if (this.shmaSort == 1) {
        setTimeout(() => {
          const className = this.__getElementByClass('datatable-body');
          className.scrollTo({
            top: 5,
            left: 9650
          });
          this.shmaSort = 0;
        }, 100);
      } else {
        setTimeout(() => {
          this.scrollService.scrollToElementById('top');
        }, 600);
      }
      if (this.showAllCheckRoads) {
        let  roadsTab1 = this.roadsTab1;
        this.roadsTab1FalseAllCheck=roadsTab1;
        this.roadsTab1 = [];
        roadsTab1.forEach (e=>{
          if(e.checked){
            this.roadsTab1.push(e);
          }
        });
        this.loading = false;
        this.filterService.loadingMap=false;
      } else {
        this.loading = false;
        this.filterService.loadingMap=false;
      }
    });
  }
  editRoad(item): void {
    const dialogRef = this.dialog.open(EditRoadDialog, {////
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
  public addRoadToMap(object, event) {
    if (event.checked == true) {
      var findRoad = this.roadsTab1.find(x => x.LVRR_ID == object.LVRR_ID);
      var findRoadFromAll = this.filterService.mapRoadsArrayAll.find(y => y.LVRR_ID == object.LVRR_ID);
      findRoad.checked = true;
      findRoad.checkedFilter = false;
      var clone = Object.create(findRoad);
      this.filterService.roadTab2.push(clone);
      findRoadFromAll.checked = true;
      findRoadFromAll.checkedFilter = false;
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
  onSort(event) {
    window.dispatchEvent(new Event('resize'));
    this.orderCol = event.column.prop;
    this.descAsc = event.newValue;
    this.shmaSort = 1;
    if (this.orderCol == 'mca') {
      this.getRoadsPyParams();
    }
  }
  private __getElementByClass(className: string): HTMLElement {
    const element = <HTMLElement>document.querySelector(`.${className}`);
    return element;
  }

  public calculateCriteria() {
    const dialogRef = this.dialog.open(CriteriaConfirmationDialog, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading=true;
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
  snapshotDialog() {
    const dialogRef = this.dialog.open(HistoryDialog, {
      width: '800px',
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
}
@Component({
  selector: './notes-dialog',
  templateUrl: '../roads/notes-dialog.html'
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
  templateUrl: '../roads/delete-note-dialog.html'
})
export class DeleteNoteDialog implements OnInit {//
  @Output() dismiss = new EventEmitter();
  @Output() focusout = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<DeleteNoteDialog>, public dialog: MatDialog, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
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
  constructor(public dialogRef: MatDialogRef<AddingNoteDialog>,public validationService : ValidationService, public dialog: MatDialog, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
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
  public saveNote() {
    if (this.editForm2.invalid) {
      this.validationService.validateAllFormFields(this.editForm2);
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
  version = VERSION;
  imageData = [];
  public loading: boolean;
  public searchTextImages: '';
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
  constructor(public dialogRef: MatDialogRef<ConfirmUploadPhotoDialog>,
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
  templateUrl: '../roads/edit-road-dialog.html'
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
  security;
  lengthInMetres;
  elevationInMetres;
  lvrr_id;
  populationServed;
  facilitiesServed;
  accessToGCsRMs;
  farmToTheMarket;
  ftm;
  agricultureFacilitation;
  linksToMajorActivityCentres;
  numberOfConnections;
  roadCondition;
  roadConditionCriterio;
  requirementsForEarthWorks;
  connectivity;
  trafficVolume;
  safety;
  roadQualityAndNeeds;
  environmentalImpacts;
  roadAccessibility;
  constructor(public dialogRef: MatDialogRef<EditRoadDialog>,
              private formBuilder: FormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private snackBar: MatSnackBar, public router: Router,public validationService : ValidationService,
  ) {
  }
  ngOnInit() {
    this.ftm = -1;
    this.name = this.data.name;
    this.ref = this.data.ref;
    this.oneway = this.data.oneway;
    this.lvrr_id = this.data.LVRR_ID;
    this.fclass = this.data.fclass;
    this.ref = this.data.ref;
    this.roadAccessibility = this.data.roadAccessibility;
    this.oneway = this.data.oneway;
    this.maxspeed = this.data.maxspeed;
    this.layer = this.data.layer;
    this.bridgeMat = this.data.bridge;
    this.tunnelMat = this.data.tunnel;
    this.source = this.data.source;
    this.safety = this.data.safety;
    this.lengthInMetres = this.data.lengthInMetres;
    this.elevationInMetres = this.data.elevationInMetres;
    this.populationServed = this.data.populationServed;
    this.facilitiesServed = this.data.facilitiesServed;
    this.accessToGCsRMs = this.data.accessToGCsRMs;
    this.connectivity = this.data.connectivity;
    this.trafficVolume = this.data.trafficVolume;
    this.security = this.data.security;
    this.farmToTheMarket = this.data.farmToTheMarket;
    this.agricultureFacilitation = this.data.agricultureFacilitation;
    this.linksToMajorActivityCentres = this.data.facilitiesServed + this.data.accessToGCsRMs;
    this.numberOfConnections = this.data.numberOfConnections;
    this.roadCondition = this.data.roadCondition;
    this.roadConditionCriterio = this.data.roadConditionCriterio;
    this.roadQualityAndNeeds = this.data.roadQualityAndNeeds;
    this.environmentalImpacts = this.data.environmentalImpacts;
    this.requirementsForEarthWorks = this.data.requirementsForEarthWorks;
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
      safety: [this.safety],
      requirementsForEarthWorks: [this.requirementsForEarthWorks],
      environmentalImpacts: [this.environmentalImpacts],
      lengthInMetres: [this.lengthInMetres, Validators.min(0)],
      elevationInMetres: [this.elevationInMetres, Validators.min(0)],
      populationServed: [this.populationServed, Validators.min(0)],
      facilitiesServed: [this.facilitiesServed, Validators.min(0)],
      accessToGCsRMs: [this.accessToGCsRMs],
      connectivity: [this.connectivity, [Validators.min(0), Validators.max(5)]],
      trafficVolume: [this.trafficVolume, Validators.required],
      security: [this.security, Validators.required],
      farmToTheMarket: [this.farmToTheMarket, Validators.required],
      agricultureFacilitation: [this.agricultureFacilitation, Validators.required],
      linksToMajorActivityCentres: [this.linksToMajorActivityCentres, Validators.required],
      numberOfConnections: [this.numberOfConnections],
      roadCondition: [this.roadCondition, Validators.required],
      roadQualityAndNeeds: [this.roadQualityAndNeeds, Validators.required],
      roadConditionCriterio: [this.roadConditionCriterio, Validators.required],
      roadAccessibility: [this.roadAccessibility, Validators.required]
    });
  }

  get f() {
    return this.editForm.controls;
  }
  ftthemarket(value) {
  }
  public save() {
    if (this.editForm.invalid) {
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});
      this.validationService.validateAllFormFields(this.editForm);
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
      trafficVolume: this.f.trafficVolume.value,
      security: this.f.security.value,
      source: this.source,
      farmToTheMarket: this.farmToTheMarket,
      lengthInMetres: this.f.lengthInMetres.value,
      elevationInMetres: this.f.elevationInMetres.value,
      populationServed: this.f.populationServed.value,
      facilitiesServed: this.f.facilitiesServed.value,
      accessToGCsRMs: this.f.accessToGCsRMs.value,
      agricultureFacilitation: this.agricultureFacilitation,
      linksToMajorActivityCentres: this.f.linksToMajorActivityCentres.value,
      numberOfConnections: this.f.numberOfConnections.value,
      roadCondition: this.f.roadCondition.value,
      roadConditionCriterio: this.f.roadConditionCriterio.value,
      roadAccessibility: this.f.roadAccessibility.value,
      roadQualityAndNeeds: this.f.roadQualityAndNeeds.value,
      environmentalImpacts: this.f.environmentalImpacts.value,
      safety: this.f.safety.value,
      requirementsForEarthWorks: this.f.requirementsForEarthWorks.value,
      id: this.data.id
    };
    this.dialogRef.close(resultObject);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
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
export class HistoryDialog implements OnInit {//
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
        } else if (finalRes.exporter == 'XLSX') {
          this.dataservice.getAllFromRoadsHistory(finalRes).subscribe(response => {
            this.excelPdfExporterService.convertAsXls(response.data);
          });
        }
      }
    });
  }
  deleteSnapshot(snapshot) {//
    const dialogRef = this.dialog.open(DeleteSnapshotDialog, {//
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
