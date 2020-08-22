import {AfterViewChecked, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FilterService} from '../../services/filter.service';
import {EditRoadDialog} from '../qgis-map/qgis-map.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {ScrollService} from '../../services/scroll.service';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.css']
})


export class FacilitiesComponent implements OnInit  {
  public distCode;
  public proCode;
  public provinceName;
  public district_name;
  public currentTab;
  public loading;
  public facilitiesMerged = [];
  public finalfacilitiesMerged = [];
  limit;
  public dataDistCenters = [];
  public dataSchools = [];
  public dataMosques = [];
  public num_district_code;
  public num_province_code;
  public type;
  public userSelectionsForMapShow = [];
  private nameFilter: string;

  ngOnInit(): void {

    this.loading=false;

    this.nameFilter='';
    this.proCode = 0;
    this.type = 'Both';
    this.limit = 16;
  }

  constructor(private el: ElementRef,public dataservice: DataService, public filterService: FilterService, public dialog: MatDialog, private snackBar: MatSnackBar, private scrollService: ScrollService,) {

  }
  private __getElementByClass(className: string): HTMLElement {
    const element = <HTMLElement>document.querySelector(`.${className}`);
    return element;
  }

  public test() {
  }

  public getFacilities() {
    this.loading=true;
    this.dataservice.get_facilities({
      'num_district_code': this.num_district_code,
      'num_province_code': this.num_province_code,
      'nameFilter': this.nameFilter,
      'type': this.type
    }).subscribe(response => {
      this.finalfacilitiesMerged = response.data;
      this.facilitiesMerged =  response.data;
      this.finalfacilitiesMerged = this.facilitiesMerged;


      if (this.filterService.tab == 2) {
        setTimeout(function () {
          if (this.document.getElementsByClassName('datatable-body')[0] != undefined) {
            this.document.getElementsByClassName('datatable-body')[0].style.maxHeight = this.document.getElementsByClassName('example-container')[0].offsetHeight - (218) + 'px';
          }
        }, 600, false);

      }


      this.userSelectionsForMapShow.forEach(e => {
        for (var i = 0; i < this.finalfacilitiesMerged.length; i++) {
          if (this.finalfacilitiesMerged[i].main_type == e.main_type && this.finalfacilitiesMerged[i].id == e.id) {
            this.finalfacilitiesMerged[i].checked = true;
            this.finalfacilitiesMerged[i].checkedFilter = this.finalfacilitiesMerged[i].checkedFilter;
          }
        }
      });
      this.loading=false;

      window.dispatchEvent(new Event('resize'));
      this.scrollService.scrollToElementById('top');
      this.scrollService.scrollToElementById('init');
    });
  }





  public getFiltersType(type) {
    this.type = type;
    this.getFacilities();
  }

  updateFilters(nameFilter: string) {
    this.nameFilter=nameFilter;
    this.getFacilities();
  }


  setDistrict(currentNum_district_code: any, currentTab, current_province_code: any, provinceName, districtName) {

    setTimeout(() => {
      this.scrollService.scrollToElementById('top')
    }, 100);

    if (currentTab == true && current_province_code) {
      if (current_province_code == this.num_province_code && currentNum_district_code == this.num_district_code) {
        this.getFacilities();
      } else {
        this.num_district_code = currentNum_district_code;
        this.num_province_code = current_province_code;
        this.provinceName = provinceName;
        this.district_name = districtName;
        this.getFacilities();
      }
    }
  }


  // onScroll(offsetY: number) {
  //   // total height of all rows in the viewport
  //   const viewHeight = this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;
  //
  //   // check if we scrolled to the end of the viewport
  //   if (!this.isLoading && offsetY + viewHeight >= this.rows.length * this.rowHeight) {
  //     // total number of results to load
  //     let limit = this.pageLimit;
  //
  //     // check if we haven't fetched any results yet
  //     if (this.rows.length === 0) {
  //       // calculate the number of rows that fit within viewport
  //       const pageSize = Math.ceil(viewHeight / this.rowHeight);
  //
  //       // change the limit to pageSize such that we fill the first page entirely
  //       // (otherwise, we won't be able to scroll past it)
  //       limit = Math.max(pageSize, this.pageLimit);
  //     }
  //     this.loadPage(limit);
  //   }
  // }


  public selectRow(row, event) {

    console.log(row);

    if (event.checked == true) {
      this.userSelectionsForMapShow.push(row);
    } else {
      row.checkedFilter = false;
      for (var i = 0; i < this.userSelectionsForMapShow.length; i++) {
        if (this.userSelectionsForMapShow[i].id == row.id && this.userSelectionsForMapShow[i].type == row.type) {
          this.userSelectionsForMapShow.splice(i, 1);

        }
      }
    }
    this.filterService.facilitiesArray = this.userSelectionsForMapShow;

  }

  public setLimit(FacilitislimitPage) {
    this.limit = FacilitislimitPage;
    this.filterService.facilitiesLimitTab = FacilitislimitPage;
  }

  public resetFilters(type) {
    this.type = type;
    this.limit = 16;
    this.nameFilter ="";
    this.filterService.facilitiesLimitTab = 16;
    this.filterService.facilitiesType = type;
    this.getFacilities();
  }

  selectAllCheckMethod(selectAllCheckFacilities: any) {
    if (selectAllCheckFacilities) {
      this.finalfacilitiesMerged.forEach(element => {
        element.checked = false;
        this.userSelectionsForMapShow = [];
      });
    } else {
      this.finalfacilitiesMerged.forEach(element => {
        element.checked = true;
        this.userSelectionsForMapShow.push(element);
      });
    }
    this.filterService.facilitiesArray = this.userSelectionsForMapShow;
  }



  public editFacilitie(row) {
    row.proCode = this.num_province_code;
    row.distrCode = this.num_district_code;
    row.district_name = this.district_name;
    row.proName = this.provinceName;
    row.updateMode = 1;

    const dialogRef = this.dialog.open(MosqueDialog, {
      width: '800px',
      data: row
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.updateFacilitie(result).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            if (this.num_province_code != null || this.num_district_code != null) {
              this.getFacilities();
            }
          } else {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        });
      }
    });


  }




  public deleteDC(row){
    const dialogRef = this.dialog.open(DeleteDcDialog, {
      width: '600px',
      data: row
    });





    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.dataservice.deleteFacilitie(row).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            this.getFacilities();
          } else {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        });

      }
    });

  }


  public addDistrictCenter() {
    const dialogRef = this.dialog.open(AddDCDialog, {
      width: '800px',
      data: {
        'proCode': this.num_province_code,
        'distrCode': this.num_district_code,
        'district_name': this.district_name,
        'proName': this.provinceName,
        'updateMode': 0
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        this.dataservice.addDistrictCenter(result).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            if (this.num_province_code != null || this.num_district_code != null) {
              this.getFacilities();
            }
          } else {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        });
      }
    });
  }


  public addSchool (){
    const dialogRef = this.dialog.open(AddSchoolDialog, {
      width: '800px',
      data: {
        'proCode': this.num_province_code,
        'distrCode': this.num_district_code,
        'district_name': this.district_name,
        'proName': this.provinceName,
        'updateMode': 0
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.addSchool(result).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            if (this.num_province_code != null || this.num_district_code != null) {
              this.getFacilities();
            }
          } else {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        });
      }
    });
  }




  public addFacilitie() {
    const dialogRef = this.dialog.open(MosqueDialog, {
      width: '800px',
      data: {
        'proCode': this.num_province_code,
        'distrCode': this.num_district_code,
        'district_name': this.district_name,
        'proName': this.provinceName,
        'updateMode': 0
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        this.dataservice.addFacilitie(result).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            if (this.num_province_code != null || this.num_district_code != null) {
              this.getFacilities();
            }
          } else {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        });
      }
    });
  }



}


@Component({
  selector: './mosque-dialog',
  templateUrl: './mosque-dialog.html'
})
export class MosqueDialog implements OnInit {
  editForm2: FormGroup;
  label:string;
  type:string;
  east:number;
  north:number;

  fromSource:string;
  distName:string;
  distCode:number;


  proCode:number;
  districtType:string;
  proCenter:string;
  num_province_code:number;
  num_district_code:number;
  altDistName:string;
  distrCode;
  public selectControlProvince = new FormControl();
  public selectControlDistrict = new FormControl();
  districts = [];
  provinces = [];
  id;


  constructor(public dialogRef: MatDialogRef<AddSchoolDialog>,
              private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private snackBar: MatSnackBar
  ) {
  }
  ngOnInit() {

    window.dispatchEvent(new Event('resize'));

    console.log(this.data)

    this.editForm2 = this.formBuilder.group({

      num_district_code: [0, Validators.required],
      num_province_code: [0, Validators.required],
      east: [0, Validators.min(0)],
      north: [0, Validators.min(0)],
      label: ["", Validators.required],
      type: ["",Validators.required],
      fromSource: ["",Validators.required]


    });
    if (this.data.updateMode == 1) {

      this.id=this.data.id;

      this.east = this.data.east;
      this.north = this.data.north;
      this.proCode = this.data.proCode;
      this.label = this.data.label;
      this.type = this.data.type;
      this.fromSource = this.data.fromSource;
      this.proCenter = this.data.proCenter;
      this.num_province_code = this.proCode;
      this.provinces.push({
        'num_province_code': this.proCode,
        'province_name': this.data.proName,
      });
      this.num_district_code = this.data.distCode;
      this.num_province_code = this.data.proCode;
      this.districts.push({
        'num_district_code': this.num_district_code,
        'district_name': this.data.distName,
      });


      this.editForm2.setValue({
        num_district_code: [this.num_district_code, Validators.required],
        num_province_code: [this.num_province_code, Validators.required],
        east: [ this.east, Validators.min(0)],
        north: [this.north, Validators.min(0)],
        label: [this.label, Validators.required],
        type: [this.type,Validators.required],
        fromSource: [this.fromSource,Validators.required]});
    }else{


      this.east = 0;
      this.north = 0;
      this.proCode = this.data.proCode;
      this.distrCode = this.data.distrCode;

      this.label ="";
      this.type ="";
      this.fromSource ="";


    //  this.validateAllFormFields(this.editForm2);






    }


    if ((this.data.proCode != null && this.data.distrCode != null) && (this.data.proCode != '' && this.data.distrCode != '')) {
      this.num_district_code = this.data.distrCode;
      this.num_province_code = this.data.proCode;
      this.districts.push({
        'num_district_code': this.num_district_code,
        'district_name': this.data.district_name,
      });


      this.num_province_code = this.proCode;
      this.provinces.push({
        'num_province_code': this.proCode,
        'province_name': this.data.proName,
      });
    } else if (this.data.proCode != null) {
      this.num_province_code = this.proCode;
      this.provinces.push({
        'num_province_code': this.proCode,
        'province_name': this.data.proName,
      });
    } else {
      this.getProvinces();
    }



  }

  public getProvinces() {
    this.dataService.get_province().subscribe(response => {
      this.provinces = response.data;
    });
  }

  public getDistricts() {
    this.dataService.get_districts({num_province_code: this.num_province_code}).subscribe(response => {
      this.districts = response.data;
    });
  }


  styleObjectPr(): Object { // //{'border-color':f.districtId.errors?'#ff0000!important':'#e6e6e6!important'}
    if (this.f.num_province_code.errors) {
      return {
        border: '1px solid red',
        height: '40px',
        'border-radius': '6px',
      };
    }
    return {};
  }

  styleObjectD(): Object { // //{'border-color':f.districtId.errors?'#ff0000!important':'#e6e6e6!important'}
    if (this.f.num_district_code.errors) {
      return {
        border: '1px solid red',
        height: '40px',
        'border-radius': '6px',
      };
    }
    return {};
  }

  get f() {
    return this.editForm2.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }


  public saveDC() {
    if (this.editForm2.invalid) {
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});

      this.validateAllFormFields(this.editForm2);
      return;
    }

    let resultObject = {//centerType altDistName
      num_district_code: this.f.num_district_code.value,
      num_province_code: this.f.num_province_code.value,
      type: this.type,
      fromSource: this.fromSource,
      label: this.f.label.value,
      east: this.f.east.value,
      north: this.f.north.value,
      id: this.id,
    };
    this.dialogRef.close(resultObject);
  }
}






@Component({
  selector: './add-school-dialog',
  templateUrl: './add-school-dialog.html'
})
export class AddSchoolDialog implements OnInit {
  editForm2: FormGroup;





  targetFid:number;
  name:string;
  type:string;
  east:number;
  north:number;
  eastUtm42:number;
  northUtm42:number;
  from:string;
  distName:string;
  distCode:number;

  proCode:number;
  districtType:string;
  proCenter:string;
  num_province_code:number;
  num_district_code:number;
  altDistName:string;
  distrCode;
  public selectControlProvince = new FormControl();
  public selectControlDistrict = new FormControl();
  districts = [];
  provinces = [];
  id;


  constructor(public dialogRef: MatDialogRef<AddSchoolDialog>,
              private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private snackBar: MatSnackBar
  ) {
  }
  ngOnInit() {



    this.editForm2 = this.formBuilder.group({

      num_district_code: [0, Validators.required],
      num_province_code: [0, Validators.required],
      east: [0, Validators.min(0)],
      north: [0, Validators.min(0)],
      northUtm42: [0, Validators.min(0)],
      eastUtm42: [0, Validators.min(0)],
      targetFid: [0, Validators.min(0)],
      name: ["", Validators.required],
      type: ["",Validators.required],
      from: ["",Validators.required],
      altDistName: ["", Validators.required]



    });
    if (this.data.updateMode == 1) {

      this.id=this.data.id;

      this.east = this.data.east;
      this.north = this.data.north;
      this.northUtm42 =this.data.northUtm42;
      this.eastUtm42 =this.data.eastUtm42;
      this.proCode = this.data.proCode;
      this.targetFid = this.data.targetFid;
      this.name = this.data.name;
      this.type = this.data.type;
      this.from = this.data.from;
      this.altDistName = this.data.altDistName;
      this.proCenter = this.data.proCenter;
      this.num_province_code = this.proCode;
      this.provinces.push({
        'num_province_code': this.proCode,
        'province_name': this.data.proName,
      });
      this.num_district_code = this.data.distCode;
      this.num_province_code = this.data.proCode;
      this.districts.push({
        'num_district_code': this.num_district_code,
        'district_name': this.data.distName,
      });


      this.editForm2.setValue({
        num_district_code: [this.num_district_code, Validators.required],
        num_province_code: [this.num_province_code, Validators.required],
        east: [ this.east, Validators.min(0)],
        north: [this.north, Validators.min(0)],
        northUtm42: [this.northUtm42, Validators.min(0)],
        eastUtm42: [this.eastUtm42, Validators.min(0)],
        targetFid: [this.targetFid, Validators.min(0)],
        name: [this.name, Validators.required],
        type: [this.type,Validators.required],
        from: [this.from,Validators.required],
        altDistName: [this.altDistName, Validators.required]
      });
    }else{


      this.east = 0;
      this.north = 0;
      this.northUtm42 = 0;
      this.eastUtm42 = 0;
      this.proCode = this.data.proCode;
      this.distrCode = this.data.distrCode;

      this.targetFid =0;
      this.name ="";
      this.type ="";
      this.from ="";
      this.altDistName ="";


      this.validateAllFormFields(this.editForm2);






    }


    if ((this.data.proCode != null && this.data.distrCode != null) && (this.data.proCode != '' && this.data.distrCode != '')) {
      this.num_district_code = this.data.distrCode;
      this.num_province_code = this.data.proCode;
      this.districts.push({
        'num_district_code': this.num_district_code,
        'district_name': this.data.district_name,
      });


      this.num_province_code = this.proCode;
      this.provinces.push({
        'num_province_code': this.proCode,
        'province_name': this.data.proName,
      });
    } else if (this.data.proCode != null) {
      this.num_province_code = this.proCode;
      this.provinces.push({
        'num_province_code': this.proCode,
        'province_name': this.data.proName,
      });
    } else {
      this.getProvinces();
    }



  }

  public getProvinces() {
    this.dataService.get_province().subscribe(response => {
      this.provinces = response.data;
    });
  }

  public getDistricts() {
    this.dataService.get_districts({num_province_code: this.num_province_code}).subscribe(response => {
      this.districts = response.data;
    });
  }


  styleObjectPr(): Object { // //{'border-color':f.districtId.errors?'#ff0000!important':'#e6e6e6!important'}
    if (this.f.num_province_code.errors) {
      return {
        border: '1px solid red',
        height: '40px',
        'border-radius': '6px',
      };
    }
    return {};
  }

  styleObjectD(): Object { // //{'border-color':f.districtId.errors?'#ff0000!important':'#e6e6e6!important'}
    if (this.f.num_district_code.errors) {
      return {
        border: '1px solid red',
        height: '40px',
        'border-radius': '6px',
      };
    }
    return {};
  }

  get f() {
    return this.editForm2.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }


  public saveDC() {
    if (this.editForm2.invalid) {
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});

      this.validateAllFormFields(this.editForm2);
      return;
    }

    let resultObject = {//centerType altDistName
      num_district_code: this.f.num_district_code.value,
      num_province_code: this.f.num_province_code.value,
      type: this.type,
      from: this.from,
      altDistName: this.f.altDistName.value,
      name: this.f.name.value,
      targetFid: this.f.targetFid.value,
      east: this.f.east.value,
      north: this.f.north.value,
      northUtm42: this.f.northUtm42.value,
      eastUtm42: this.f.eastUtm42.value,
      id: this.id,
    };
    this.dialogRef.close(resultObject);
  }
}






@Component({
  selector: './delete-dc-dialog',
  templateUrl: './delete-dc-dialog.html'
})
export class DeleteDcDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteDcDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  ngOnInit() {}


  onNoClick(): void {
    this.dialogRef.close();
  }

  public deleteYes() {
    this.dialogRef.close(true);

  }
}



@Component({
  selector: './add-dc-dialog',
  templateUrl: './add-dc-dialog.html'
})
export class AddDCDialog implements OnInit {
  editForm2: FormGroup;
  nameDC;
  proCenter;
  proCode;
  east;
  northUtm42;
  eastUtm42;
  north;
  districtType;
  num_district_code;
  num_province_code;
  public selectControlProvince = new FormControl();
  public selectControlDistrict = new FormControl();
  districts = [];
  provinces = [];
  id;

  constructor(public dialogRef: MatDialogRef<AddDCDialog>,
              private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private snackBar: MatSnackBar
  ) {
  }
  ngOnInit() {
    this.editForm2 = this.formBuilder.group({
      proCenter: ["", Validators.required],
      num_district_code: [0, Validators.required],
      districtType: [""],
      num_province_code: ["", Validators.required],
      east: [0, Validators.min(0)],
      north: [0, Validators.min(0)],
      northUtm42: [0, Validators.min(0)],
      eastUtm42: [0, Validators.min(0)]
    });
    if (this.data.updateMode == 1) {

      this.id=this.data.id;
      this.east = this.data.east;
      this.north = this.data.north;
      this.northUtm42 =this.data.northUtm42;
      this.eastUtm42 =this.data.eastUtm42;
      this.districtType = this.data.centerType;
      this.proCode = this.data.proCode;
      this.proCenter = this.data.proCenter;
      this.num_province_code = this.proCode;
      this.provinces.push({
        'num_province_code': this.proCode,
        'province_name': this.data.proName,
      });
      this.num_district_code = this.data.distCode;
      this.num_province_code = this.data.proCode;
      this.districts.push({
        'num_district_code': this.num_district_code,
        'district_name': this.data.distName,
      });
      this.editForm2.setValue({
        proCenter: this.proCenter,
        num_district_code: this.num_district_code,
        districtType: this.districtType,
        num_province_code: this.num_province_code,
        east: this.east,
        north: this.north,
        northUtm42: this.northUtm42,
        eastUtm42: this.eastUtm42
      });
    }else{
      this.east = 0;
      this.north = 0;
      this.northUtm42 = 0;
      this.eastUtm42 = 0;
      this.districtType = 'District';
      this.proCode = this.data.proCode;
      this.proCenter ="";
    }
    if ((this.data.proCode != null && this.data.distrCode != null) && (this.data.proCode != '' && this.data.distrCode != '')) {
      this.num_district_code = this.data.distrCode;
      this.num_province_code = this.data.proCode;
      this.districts.push({
        'num_district_code': this.num_district_code,
        'district_name': this.data.district_name,
      });
      this.num_province_code = this.proCode;
      this.provinces.push({
        'num_province_code': this.proCode,
        'province_name': this.data.proName,
      });
    } else if (this.data.proCode != null) {
      this.num_province_code = this.proCode;
      this.provinces.push({
        'num_province_code': this.proCode,
        'province_name': this.data.proName,
      });
    } else {
      this.getProvinces();
    }
   // this.validateAllFormFields(this.editForm2);
  }

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }

  public getProvinces() {
    this.dataService.get_province().subscribe(response => {
      this.provinces = response.data;
    });
  }

  public getDistricts() {
    this.dataService.get_districts({num_province_code: this.num_province_code}).subscribe(response => {
      this.districts = response.data;
    });
  }


  styleObjectPr(): Object { // //{'border-color':f.districtId.errors?'#ff0000!important':'#e6e6e6!important'}
    if (this.f.num_province_code.errors) {
      return {
        border: '1px solid red',
        height: '40px',
        'border-radius': '6px',
      };
    }
    return {};
  }

  styleObjectD(): Object { // //{'border-color':f.districtId.errors?'#ff0000!important':'#e6e6e6!important'}
    if (this.f.num_district_code.errors) {
      return {
        border: '1px solid red',
        height: '40px',
        'border-radius': '6px',
      };
    }
    return {};
  }

  get f() {
    return this.editForm2.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public saveDC() {
    if (this.editForm2.invalid) {
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});

      return;
    }


    let resultObject = {//centerType
      proCenter: this.f.proCenter.value,
      num_district_code: this.f.num_district_code.value,
      num_province_code: this.f.num_province_code.value,
      proCode: this.proCode,
      districtType: this.districtType,
      east: this.f.east.value,
      north: this.f.north.value,
      northUtm42: this.f.northUtm42.value,
      id: this.id,
      eastUtm42: this.f.eastUtm42.value


    };
    this.dialogRef.close(resultObject);
  }
}


