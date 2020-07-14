import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  username = "";
  pwd = "";
  password = "";
loading;

  constructor(private authService: AuthService,private snackBar: MatSnackBar,private formBuilder: FormBuilder, private router: Router,private dataService : DataService) {

  }
  ngOnInit() {
    this.editForm = this.formBuilder.group({

      username: ['', Validators.required],
      password: ['', Validators.required]

    });


    if(this.authService.isAuthenticated()){

      if(localStorage.getItem("role")=='Producer'){
        this.router.navigate(['/homeProducer'])

      }else if (localStorage.getItem("role")=='Consumer'){
        this.router.navigate(['/homeConsumer'])

      }


    }

    this.loading=false;



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
      "username":this.f.username.value,
      "password":this.f.password.value
    }).subscribe(response=>{
      if(response.status=='ok'){
        this.snackBar.open(
          response.message,
          'x',
          <MatSnackBarConfig>{duration: 3000}
        );

        localStorage.setItem("role",response.role);
        localStorage.setItem("id",response.id);





        this.loading=false;

        if(response.role=='Consumer'){

          this.dataService.getUserById({id:response.id}).subscribe(response=>{
            if(response.status=='ok'){
              localStorage.setItem("username",response.data[0].username);
              this.router.navigate(['/homeConsumer',{ queryParams: { username: response.data[0].username } }]);

            }

          });



        }else if (response.role=='Producer'){

          this.dataService.getUserById({id:response.id}).subscribe(response=>{
            console.log(response);
            if(response.status=='ok'){
              localStorage.setItem("username",response.data[0].username);
              localStorage.setItem("companyName",response.data[0].company.companyName);
              this.router.navigate(['/homeProducer'] ,{ queryParams: { username: response.data[0].username, companyName:response.data[0].company.companyName   } });
            }
          });






        }


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


}
