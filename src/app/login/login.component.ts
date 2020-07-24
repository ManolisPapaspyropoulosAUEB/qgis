import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  editForm: FormGroup;
  email = "";
  pwd = "";
  password = "";
loading;
  public reactiveForm: FormGroup = new FormGroup({
    recaptchaReactive: new FormControl(null, Validators.required)
  });
  recaptcha: string;

  constructor(private authService: AuthService,private snackBar: MatSnackBar,private formBuilder: FormBuilder, private router: Router,private dataService : DataService) {

  }
  ngOnInit() {

    // localStorage.removeItem('id');
    // localStorage.removeItem('email');
    // localStorage.setItem("provinceItemName", null);
    // localStorage.setItem("num_province_code",null);
    // localStorage.setItem("districtItemName",null);
    // localStorage.setItem("num_district_code",null);


    console.log();
    this.recaptcha = null;

    this.editForm = this.formBuilder.group({

      email: ['', [Validators.required,Validators.email]],
      recaptcha: [this.recaptcha, Validators.required],
      password: ['', Validators.required]

    });


    console.log(this.authService.isAuthenticated());

    if(this.authService.isAuthenticated()){

      console.log(this.authService.isAuthenticated());

      this.router.navigate(['/map'])
    }

    this.loading=false;



  }


  handleSuccess(e) {
    this.recaptcha=e;
    console.log("ReCaptcha", e);
  }

  resolved(captchaResponse: string) {
    this.recaptcha = captchaResponse;
  }



  get f() {
    return this.editForm.controls;
  }

  onSubmitForm() {
    if (this.editForm.invalid) {
      return;
    }
    this.loading=true;
    this.dataService.login({
      "email":this.f.email.value,
      "pwd":this.f.password.value
    }).subscribe(response=>{
      if(response.status=='ok'){
        this.snackBar.open(
          response.message,
          'x',
          <MatSnackBarConfig>{duration: 3000}
        );
        localStorage.setItem("email",response.role);
        localStorage.setItem("id",response.id);
        this.router.navigate(['/qgis'])
      }else{
        this.loading=false;

        this.snackBar.open(
          response.message,
          'x',
          <MatSnackBarConfig>{duration: 3000}
        );
      }
    })



  }

  goToRegisterPage() {
    this.router.navigate(['/register'])
  }


  forgotPassword() {
    this.router.navigate(['/forgotPassword'])

  }
}
