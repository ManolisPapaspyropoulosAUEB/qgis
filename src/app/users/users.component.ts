import {Component, Inject, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

   users = [];
  constructor(private dataservice : DataService, public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.dataservice.getUsers({}).subscribe(res=>{
      this.users=res.data;
    })
  }



  public addUser() {
    const dialogRef = this.dialog.open(UserDialogUpdate, {
      width: '800px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }


}




@Component({
  selector: './user-dialog-update',
  templateUrl: './user-dialog-update.html'
})
export class UserDialogUpdate implements OnInit {
  editForm2: FormGroup;
  name;
  lastname;
  username;
  email;
  password;
  selectedDistricts;
  districts=[];
  districtName;



  constructor(public dialogRef: MatDialogRef<UserDialogUpdate>,
              private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private snackBar: MatSnackBar) {}

  ngOnInit() {

    this.getDistricts();
    this.name='';
    this.lastname='';
    this.username='';
    this.email='';
    this.password='';
    this.selectedDistricts=[];

    this.editForm2 = this.formBuilder.group({

      name: [ this.name, Validators.required],
      lastname: [ this.lastname, Validators.required],
      username: [ this.username, Validators.required],
      email: [ this.email, [Validators.required,Validators.email]],
      password: [ this.password, Validators.required],
      selectedDistricts: [ this.selectedDistricts, Validators.required],



    });
  }


  getDistricts(){

    console.log(
      this.districtName
    )
    this.dataService.get_districts({
      "districtName":this.districtName
    }).subscribe(response=>{
      if(response.status=='ok'){
        this.districts=response.data;
      }
    })
  }

  searchByDistrictName(){

    this.getDistricts();

  }

  get f() {
    return this.editForm2.controls;
  }

  onNoClick(): void {
    this.dialogRef.close();
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

  public saveDC() {
    if (this.editForm2.invalid) {
      this.validateAllFormFields(this.editForm2);
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});
      return;
    }
    let resultObject = {//centerType altDistName
      // num_district_code: this.f.num_district_code.value,
      // num_province_code: this.f.num_province_code.value,
      // east: this.f.east.value,
      // north: this.f.north.value,
      // northUtm42: this.f.northUtm42.value,
      // eastUtm42: this.f.eastUtm42.value,
      // villageCo: this.f.villageCo.value,
      // village1: this.f.village1.value,
      // mapLong: this.f.mapLong.value,
      // mapLat: this.f.mapLat.value,
      // villagePop: this.f.villagePop.value,
      // villageHh: this.f.villageHh.value,
      // id: this.id,
    };
    this.dialogRef.close(resultObject);
  }
}





