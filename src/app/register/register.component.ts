import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {ValidationService} from '../../services/validation.service';

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
  constructor(private snackBar: MatSnackBar,private formBuilder: FormBuilder, private router: Router,
              public validationService : ValidationService,
              private  dataService : DataService) {
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
      this.validationService.validateAllFormFields(this.editForm);
      this.snackBar.open('Your form is not valid, make sure you fill in all required fields', 'x', <MatSnackBarConfig>{duration: 4000});

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
