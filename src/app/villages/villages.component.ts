import {Component, Inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FilterService} from '../../services/filter.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {AddDCDialog, AddSchoolDialog, DeleteDcDialog} from '../facilities/facilities.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ScrollService} from '../../services/scroll.service';

@Component({
  selector: 'app-villages',
  templateUrl: './villages.component.html',
  styleUrls: ['./villages.component.css']
})
export class VillagesComponent implements OnInit {
  public num_district_code;
  public num_province_code;
  public villages = [];
  public userSelectionsForMapShow = [];
  public villageNameFilter = '';
  public limit: any;
  private provinceName: any;
  private district_name: any;

  constructor(public dataservice: DataService, public filterService: FilterService, public dialog: MatDialog, private snackBar: MatSnackBar, private scrollService: ScrollService) {
  }

  ngOnInit(): void {
    this.limit = 16;
  }

  enableNgx(){
    setTimeout(() => {
      this.scrollService.scrollToElementById('top')
    }, 600);

  }



  setDistrict(currentNum_district_code: any, currentTab, current_province_code: any, proName, district_name) {

    if (currentTab == true && current_province_code) {
      if (current_province_code == this.num_province_code && currentNum_district_code == this.num_district_code) {
      } else {
        this.num_district_code = currentNum_district_code;
        this.num_province_code = current_province_code;
        this.provinceName = proName;
        this.district_name = district_name;
        this.getVillages();
      }
    }
  }


  getVillages() {

    this.dataservice.getVillages({
      'num_district_code': this.num_district_code,
      'num_province_code': this.num_province_code,
      'villageNameFilter': this.villageNameFilter
    }).subscribe(response => {
      this.villages = response.data;
      this.villages.forEach(element => {
        element.checked = false;
        element.checkedFilter = false;
      });



      this.userSelectionsForMapShow.forEach(e => {
        for (var i = 0; i < this.villages.length; i++) {
          if (this.villages[i].id == e.id) {
            this.villages[i].checked = true;
            this.villages[i].checkedFilter = this.villages[i].checkedFilter;
          }
        }
      });

      this.enableNgx();
    });


  }

  public selectRow(row, event) {
    if (event.checked == true) {
      this.userSelectionsForMapShow.push(row);
    } else {
      for (var i = 0; i < this.userSelectionsForMapShow.length; i++) {
        if (this.userSelectionsForMapShow[i].id == row.id && this.userSelectionsForMapShow[i].Type == row.Type) {
          this.userSelectionsForMapShow.splice(i, 1);
        }
      }
    }
    this.filterService.villagesArray = this.userSelectionsForMapShow;
    console.log(this.filterService.villagesArray);
    console.log(this.userSelectionsForMapShow);
  }

  public resetFilters(name) {
    this.villageNameFilter = name;
    this.limit = 16;
    this.filterService.villageNameFilter = name;
    this.filterService.villageLimitTab = 16
    ;
    this.getVillages();
  }

  updateFilters(villageNameFilter: string) {
    console.log(villageNameFilter);
    this.villageNameFilter = villageNameFilter;
    this.getVillages();
  }

  public setLimit(villageLimkt) {
    this.limit = villageLimkt;
    this.filterService.villageLimitTab = villageLimkt;
  }

  selectAllCheckMethod(selectAllCheckFacilities: any) {
    if (selectAllCheckFacilities) {
      this.villages.forEach(element => {
        element.checked = false;
        this.userSelectionsForMapShow = [];
      });
    } else {
      this.villages.forEach(element => {
        console.log(element);
        element.checked = true;
        this.userSelectionsForMapShow.push(element);
      });
    }

    this.filterService.villagesArray = this.userSelectionsForMapShow;

  }




  public editVillage(village) {


    console.log(village);


    village.proCode = this.num_province_code;

    village.district_name = this.district_name;
    village.proName = this.provinceName;
    village.updateMode = 1;

    const dialogRef = this.dialog.open(VillageDialog, {
      width: '800px',
      data: village
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.dataservice.updateVillage(result).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            if (this.num_province_code != null || this.num_district_code != null) {
              this.getVillages();
            }
          } else {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        });
      }
    });

  }


  public deleteVillage(village) {

    const dialogRef = this.dialog.open(DeleteVillageDialog, {
      width: '600px',
      data: village
    });





    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.deleteVillage(village).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            this.getVillages();
          } else {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
          }
        });
      }

    });



  }


  public addVillage() {
    const dialogRef = this.dialog.open(VillageDialog, {
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
        console.log(result);
        this.dataservice.addVillage(result).subscribe(response => {
          if (response.status == 'ok') {
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            if (this.num_province_code != null || this.num_district_code != null) {
              this.getVillages();
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
  selector: './delete-village-dialog',
  templateUrl: './delete-village-dialog.html'
})
export class DeleteVillageDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteVillageDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }
  ngOnInit() {}


  onNoClick(): void {
    this.dialogRef.close();
  }

  public yes() {
    this.dialogRef.close(true);



  }
}


@Component({
  selector: './village-dialog',
  templateUrl: './village-dialog.html'
})
export class VillageDialog implements OnInit {
  editForm2: FormGroup;
  public selectControlProvince = new FormControl();
  public selectControlDistrict = new FormControl();
  villageCo;
  village1;
  proCode;
  distCode;
  mapLong;
  mapLat;
  villagePop;
  villageHh;

  east: number;
  north: number;
  eastUtm42: number;
  northUtm42: number;
  distName: string;
  num_province_code: number;
  num_district_code: number;
  altDistName: string;
  distrCode;
  districts = [];
  provinces = [];
  id;


  constructor(public dialogRef: MatDialogRef<VillageDialog>,
              private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {


    console.log(this.data);
    this.editForm2 = this.formBuilder.group({

      num_district_code: [0, Validators.required],
      num_province_code: [0, Validators.required],
      east: [0, Validators.min(0)],
      north: [0, Validators.min(0)],
      northUtm42: [0, Validators.min(0)],
      eastUtm42: [0, Validators.min(0)],

      villageCo: [0, Validators.min(0)],
      village1: [0, Validators.required],
      mapLong: [0, Validators.min(0)],
      mapLat: [0, Validators.min(0)],
      villagePop: [0, Validators.min(0)],
      villageHh: [0, Validators.min(0)]


    });
    if (this.data.updateMode == 1) {

      this.id = this.data.id;

      this.east = this.data.east;
      this.north = this.data.north;
      this.northUtm42 = this.data.northUtm42;
      this.eastUtm42 = this.data.eastUtm42;
      this.proCode = this.data.proCode;

      this.villageCo = this.data.villageCo;
      this.village1 = this.data.village1;
      this.mapLong = this.data.mapLong;
      this.mapLat = this.data.mapLat;
      this.villagePop = this.data.villagePop;
      this.villageHh = this.data.villageHh;





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
        east: [this.east, Validators.min(0)],
        north: [this.north, Validators.min(0)],
        northUtm42: [this.northUtm42, Validators.min(0)],
        eastUtm42: [this.eastUtm42, Validators.min(0)],


        villageCo: [this.villageCo, Validators.min(0)],
        village1: [this.village1, Validators.required],
        mapLong: [this.mapLong, Validators.min(0)],
        mapLat: [this.mapLat, Validators.min(0)],
        villagePop: [this.villagePop, Validators.min(0)],
        villageHh: [this.villageHh, Validators.min(0)]


      });
    } else {

      console.log(this.data);

      this.east = 0;
      this.north = 0;
      this.northUtm42 = 0;
      this.eastUtm42 = 0;
      this.proCode = this.data.proCode;
      this.distrCode = this.data.distrCode;

      this.villageCo = 0;
      this.village1 = '';
      this.mapLong = 0;
      this.mapLat = 0;
      this.villagePop = 0;
      this.villageHh = 0;


    }


    if ((this.data.proCode != null && this.data.distrCode != null) && (this.data.proCode != '' && this.data.distrCode != '')) {
      this.num_district_code = this.data.distrCode;
      this.num_province_code = this.data.proCode;
      this.districts.push({
        'num_district_code': this.num_district_code,
        'district_name': this.data.district_name,
      });

      console.log(this.districts);

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
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }


  public saveDC() {
    if (this.editForm2.invalid) {
      this.validateAllFormFields(this.editForm2);
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});


      return;
    }

    let resultObject = {//centerType altDistName
      num_district_code: this.f.num_district_code.value,
      num_province_code: this.f.num_province_code.value,
      east: this.f.east.value,
      north: this.f.north.value,
      northUtm42: this.f.northUtm42.value,
      eastUtm42: this.f.eastUtm42.value,
      villageCo: this.f.villageCo.value,
      village1: this.f.village1.value,
      mapLong: this.f.mapLong.value,
      mapLat: this.f.mapLat.value,
      villagePop: this.f.villagePop.value,
      villageHh: this.f.villageHh.value,


      id: this.id,
    };
    this.dialogRef.close(resultObject);
  }
}

