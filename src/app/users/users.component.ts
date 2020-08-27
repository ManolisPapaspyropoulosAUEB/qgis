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
  name='';
   users = [];
  constructor(private dataservice : DataService, public dialog: MatDialog, private snackBar: MatSnackBar,) { }

  ngOnInit(): void {
    this.name='';
    this.getUsers();
  }

  getUsers(){
    this.dataservice.getUsers({
      name:this.name
    }).subscribe(res=>{
      this.users=res.data;
    })
  }

  getUsersFilters(name){
    this.name=name;
    this.dataservice.getUsers({
      name:this.name
    }).subscribe(res=>{
      this.users=res.data;
    })
  }



  public addUser() {
    const dialogRef = this.dialog.open(UserDialogUpdate, {
      width: '800px',
      data: {
        "mode":"add",
        "userId":0
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.dataservice.addUser(result).subscribe(response=>{

          if(response.status=='ok'){
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            this.getUsers();
          }else{
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 7000});
          }


        });

      }
    });
  }


  public editUser(user) {
    user.mode='edit';
    const dialogRef = this.dialog.open(UserDialogUpdate, {
      width: '800px',
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.editUser(result).subscribe(response=>{
          if(response.status=='ok'){
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            this.getUsers();
          }else{
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 7000});
          }
        });
      }
    });
  }

  public deleteUser(user) {
    user.mode='edit';
    const dialogRef = this.dialog.open(DeleteUserDialog, {
      width: '800px',
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataservice.deleteUser(user).subscribe(response=>{
          if(response.status=='ok'){
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});
            this.getUsers();
          }else{
            this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 7000});
          }
        });
      }
    });
  }








}

@Component({
  selector: './delete-user-dialog',
  templateUrl: './delete-user-dialog.html'
})
export class DeleteUserDialog implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeleteUserDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any) {}
  ngOnInit() {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  public yes() {
    this.dialogRef.close(true);
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
  selectedDistricts=[];
  districts=[];
  districtName;
  selectAllVariable;
  role;



  constructor(public dialogRef: MatDialogRef<UserDialogUpdate>,
              private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
              private dataService: DataService, private snackBar: MatSnackBar) {}

  ngOnInit() {


    this.districtName="";
    this.selectAllVariable=false;
    this.getDistricts();
    this.name='';
    this.lastname='';
    this.username='';
    this.email='';
    this.password='';
    this.role='user';
    this.selectedDistricts=[];
    this.editForm2 = this.formBuilder.group({
      name: [ this.name, Validators.required],
      lastname: [ this.lastname, Validators.required],
      username: [ this.username, Validators.required],
      email: [ this.email, [Validators.required,Validators.email]],
      password: [ this.password, Validators.required],
      selectedDistricts: [ this.selectedDistricts,Validators.required],
      districtName: [ this.districtName],
      role: [ this.role]
    });

    if (this.data.mode=='edit'){
      this.editForm2.get("name").setValue(this.data.name);
      this.editForm2.get("lastname").setValue(this.data.lastname);
      this.editForm2.get("username").setValue(this.data.username);
      this.editForm2.get("password").setValue(this.data.password);
      this.editForm2.get("selectedDistricts").setValue(this.data.selectedDistricts);
      if(this.data.role=="admin"){
        this.editForm2.get("role").setValue('admin');

      }else{
        this.editForm2.get("role").setValue('user');

      }
      this.editForm2.get("email").setValue(this.data.email);

      this.name=this.data.name;
      this.lastname=this.data.lastname;
      this.username=this.data.username;
      this.email=this.data.email;
      this.password=this.data.password;
      this.role=this.data.role;
      this.selectedDistricts=this.data.selectedDistricts;

      console.log(this.data.selectedDistricts);

    }


  }



  getDistricts(){

    console.log(
      this.districtName
    )
    this.dataService.get_districts({
      "districtName":this.districtName,
      "num_province_code":14
    }).subscribe(response=>{
      if(response.status=='ok'){
        this.districts=response.data;
      }
    })
  }


  printTest(){ //selectedDistricts
    console.log(this.districts);
    console.log(this.selectedDistricts);
  }


  selectAllDistricts(){
    this.selectAllVariable=!this.selectAllVariable;
    console.log(this.selectAllVariable);
    if(!this.selectAllVariable){
      this.selectedDistricts=[];
    }else{
      this.selectedDistricts=[];
      this.districts.forEach(e=>{
        this.selectedDistricts.push(e.district_name);
      })
    }
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

  public saveDC() { //addUser

    if(this.role=='admin'){
      this.editForm2.controls['selectedDistricts'].clearValidators();
      this.editForm2.controls['selectedDistricts'].updateValueAndValidity()

    }else{
      this.editForm2.controls["selectedDistricts"].setValidators(Validators.required);
   this.editForm2.controls['selectedDistricts'].updateValueAndValidity();
//addUser
    }

    if (this.editForm2.invalid) {
      this.validateAllFormFields(this.editForm2);
      this.snackBar.open('Your form is not valid,make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});
      return;
    }


    let resultObject = {//centerType altDistName role
      name: this.f.name.value,
      lastname: this.f.lastname.value,
      username: this.f.username.value,
      email: this.f.email.value,
      userId:this.data.id,
      password: this.f.password.value,
      selectedDistricts: this.f.selectedDistricts.value,
      role: this.f.role.value
    };


    this.dialogRef.close(resultObject);
  }
}


