import {Component, Inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {FilterService} from '../../services/filter.service';
import {EditRoadDialog} from '../qgis-map/qgis-map.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.css']
})


export class FacilitiesComponent implements OnInit {
  public distCode;
  public proCode;
  public provinceName;
  public district_name;
  public currentTab;
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

  ngOnInit(): void {
    this.proCode = 0;
    this.type = 'Both';
    this.limit = 16;
  }

  constructor(public dataservice: DataService, public filterService: FilterService, public dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  public test() {
  }

  public getFacilities() {
    this.dataservice.get_facilities({
      'num_district_code': this.num_district_code,
      'num_province_code': this.num_province_code,
      'type': this.type
    }).subscribe(response => {
      this.finalfacilitiesMerged = [];
      this.facilitiesMerged = [];
      // this.facilities=response.data;
      this.dataDistCenters = response.dataDistCenters;
      this.dataSchools = response.dataSchools;
      this.dataMosques = response.dataMosques;
      console.log(this.type);
      if (this.type == 'Both') {
        this.dataDistCenters.forEach(element => {
          if (element.proCode != null && element.proCode != '') {
            this.proCode = element.proCode;
          }
          this.facilitiesMerged.push({
            'proName': element.proName,
            'name': '',
            'proCenter': element.proCenter,
            'proCode': element.proCode,
            'distName': element.distName,
            'distCode': element.distCode,
            'centerType': element.centerType,
            'east': element.east,
            'id': element.id,
            'customId': element.id + 'customId',
            'north': element.north,
            'eastUtm42': element.eastUtm42,
            'northUtm42': element.northUtm42,
            'main_type': 'distcenters',
            'from': '',
            'checked': false,
            'checkedFilter': false,
            'type': 'distcenters'
          });
        });
        this.dataMosques.forEach(element => {
          this.facilitiesMerged.push({
            'proName': '',
            'name': element.NAME,
            'proCenter': '',
            'proCode': '',
            'id': element.id,
            'distName': '',
            'customId': element.id + element.Type,
            'distCode': '',
            'centerType': '',
            'east': element.east,
            'north': element.north,
            'eastUtm42': element.eastUtm42,
            'northUtm42': element.northUtm42,
            'main_type': 'mosques',
            'checked': false,
            'checkedFilter': false,

            'from': element.from,
            'type': element.type,
          });
        });
        this.dataSchools.forEach(element => {
          this.facilitiesMerged.push({
            'proName': '',
            'name': element.NAME,
            'proCenter': '',
            'proCode': '',
            'distName': '',
            'distCode': '',
            'customId': element.id + element.type,
            'centerType': '',
            'east': element.east,
            'id': element.id,
            'north': element.north,
            'eastUtm42': element.eastUtm42,
            'northUtm42': element.northUtm42,
            'main_type': 'schools',
            'from': element.from,
            'checked': false,
            'checkedFilter': false,
            'type': element.type,
          });
        });
      } else if (this.type == 'Schools') {
        this.dataSchools.forEach(element => {
          this.facilitiesMerged.push({
            'proName': '',
            'name': element.NAME,
            'proCenter': '',
            'proCode': '',
            'distName': '',
            'distCode': '',
            'centerType': '',
            'east': element.east,
            'id': element.id,
            'north': element.north,
            'eastUtm42': element.eastUtm42,
            'northUtm42': element.northUtm42,
            'main_type': 'schools',
            'from': element.from,

            'checked': false,
            'checkedFilter': false,
            'type': element.type,
          });
        });
      } else if (this.type == 'Mosques') {
        this.dataMosques.forEach(element => {

          this.facilitiesMerged.push({
            'proName': '',
            'name': element.NAME,
            'proCenter': '',
            'proCode': '',
            'id': element.id,
            'distName': '',
            'distCode': '',
            'centerType': '',
            'east': element.east,
            'north': element.north,
            'eastUtm42': element.eastUtm42,
            'northUtm42': element.northUtm42,
            'main_type': 'mosques',
            'checked': false,
            'checkedFilter': false,
            'from': element.from,
            'type': element.type,
          });

        });
      } else if (this.type == 'Distcenters') {
        this.dataDistCenters.forEach(element => {
          this.facilitiesMerged.push({
            'proName': element.proName,
            'name': '',
            'proCenter': element.proCenter,
            'proCode': element.proCode,
            'distName': element.distName,
            'distCode': element.distCode,
            'centerType': element.centerType,
            'east': element.east,
            'id': element.id,
            'north': element.north,
            'eastUtm42': element.eastUtm42,
            'northUtm42': element.northUtm42,
            'main_type': 'distcenters',
            'from': '',
            'checked': false,
            'checkedFilter': false,
            'type': 'distcenters'
          });

        });
      }
      this.finalfacilitiesMerged = this.facilitiesMerged;
      this.userSelectionsForMapShow.forEach(e => {
        for (var i = 0; i < this.finalfacilitiesMerged.length; i++) {
          if (this.finalfacilitiesMerged[i].main_type == e.main_type && this.finalfacilitiesMerged[i].id == e.id) {
            this.finalfacilitiesMerged[i].checked = true;
            this.finalfacilitiesMerged[i].checkedFilter = this.finalfacilitiesMerged[i].checkedFilter;
          }
        }
      });
      window.dispatchEvent(new Event('resize'));

    });
  }

  public getFiltersType(type) {
    this.type = type;
    this.getFacilities();
  }


  setDistrict(currentNum_district_code: any, currentTab, current_province_code: any, provinceName, districtName) {
    if (currentTab == true && current_province_code) {
      if (current_province_code == this.num_province_code && currentNum_district_code == this.num_district_code) {
      } else {
        this.num_district_code = currentNum_district_code;
        this.num_province_code = current_province_code;
        this.provinceName = provinceName;
        this.district_name = districtName;
        this.getFacilities();
      }
    }
  }

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


    console.log(this.filterService.facilitiesArray);
    console.log(this.userSelectionsForMapShow);

  }

  public setLimit(FacilitislimitPage) {
    this.limit = FacilitislimitPage;
    this.filterService.facilitiesLimitTab = FacilitislimitPage;
  }

  public resetFilters(type) {
    this.type = type;
    this.limit = 16;
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
        console.log(element);
        element.checked = true;
        this.userSelectionsForMapShow.push(element);
      });
    }
    this.filterService.facilitiesArray = this.userSelectionsForMapShow;
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

        console.log(result);

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

  editFacilitie(row) {
    row.proCode = this.num_province_code;
    row.distrCode = this.num_district_code;
    row.district_name = this.district_name;
    row.proName = this.provinceName;
    row.updateMode = 1;


    const dialogRef = this.dialog.open(AddDCDialog, {
      width: '800px',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {


        console.log(result);

        this.dataservice.updateDistrictCenter(result).subscribe(response => {
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
    console.log(resultObject);
    this.dialogRef.close(resultObject);
  }
}


