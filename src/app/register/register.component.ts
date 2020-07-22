import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  editForm: FormGroup;
  username = "";
  firstname="";
  lastname="";
  email="";
  name="";

  street="";
  city="";
  numberStreet="";


  role="Consumer";
  password="";
  loading: any;
  constructor(private snackBar: MatSnackBar,private formBuilder: FormBuilder, private router: Router,private  dataService : DataService) {
  }
  ngOnInit() {
    this.loading=false;
    this.editForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.email]]
    });
  }


  get f() {
    return this.editForm.controls;
  }


  onSubmitForm() {

    if (this.editForm.invalid) {
      return;
    }

    this.loading=true;
    let pwd = {
      email: this.f.email.value
    };



    this.dataService.forgotPwd({
      pwd:pwd

    }).subscribe(response=>{

      if(response.status=='ok'){
        this.loading=false;

        this.snackBar.open(
          response.message,
          'x',
          <MatSnackBarConfig>{duration: 3000}
        );


      }else{
        this.loading=false;
        this.snackBar.open(
          response.message,
          'x',
          <MatSnackBarConfig>{duration: 3000}
        );


      }




    });



  }


  // onSubmitForm() {
  //
  //   if (this.editForm.invalid) {
  //     return;
  //   }
  //
  //   this.loading=true;
  //   let user = {
  //     username: this.f.username.value,
  //     firstname: this.f.firstname.value,
  //     lastname: this.f.lastname.value,
  //     email: this.f.email.value,
  //     password: this.f.password.value,
  //     role: this.f.role.value
  //   };
  //
  //
  //   var company={};
  //   if(this.f.role.value=='Producer'){
  //      company = { companyName: this.f.company.value, street: this.f.street.value, city: this.f.city.value  , numberStreet:   this.f.numberStreet.value   };
  //
  //   }
  //
  //   this.dataService.register({
  //     user:user,
  //     company:company
  //
  //   }).subscribe(response=>{
  //
  //     if(response.status=='ok'){
  //       this.loading=false;
  //
  //       this.snackBar.open(
  //        response.message,
  //         'x',
  //         <MatSnackBarConfig>{duration: 3000}
  //       );
  //
  //
  //     }else{
  //       this.loading=false;
  //       this.snackBar.open(
  //         response.message,
  //         'x',
  //         <MatSnackBarConfig>{duration: 3000}
  //       );
  //
  //
  //     }
  //
  //
  //
  //
  //   });
  //
  //
  //
  // }



  goToLoginPage() {
    this.router.navigate([''])
  }
  onChaneRole() {
    this.f.company.setValidators([Validators.required]);

    this.f.street.setValidators([Validators.required]);
    this.f.city.setValidators([Validators.required]);
    this.f.numberStreet.setValidators([Validators.required]);


  }
}
