import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-producer-home',
  templateUrl: './producer-home.component.html',
  styleUrls: ['./producer-home.component.css']
})
export class ProducerHomeComponent implements OnInit {
  companyName;
  username;

  constructor(private dataservice : DataService,private router: Router) { }

  ngOnInit(): void {
    this.companyName=localStorage.getItem("companyName");
    this.username=localStorage.getItem("username");
  }


  logout() {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("companyName");


    this.router.navigate(['']);








  }


  goHome() {
    this.router.navigate(['']);
  }


  addProject() {
    this.router.navigate(['']);
  }


  products() {
    this.router.navigate(['']);
  }
}
