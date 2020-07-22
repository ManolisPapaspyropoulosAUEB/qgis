import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'manabiko-app';

  constructor(  private router: Router,private authService: AuthService) {

    // this.router.navigate(['/login'])
    // this.router.navigate([''])

  }

  ngOnInit(){
    if(this.authService.isAuthenticated()){

      console.log(this.authService.isAuthenticated());

      this.router.navigate(['/map'])
    }else{
      this.router.navigate([''])

    }
  }






}
