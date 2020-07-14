import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-consumer',
  templateUrl: './home-consumer.component.html',
  styleUrls: ['./home-consumer.component.css']
})
export class HomeConsumerComponent implements OnInit {
  username;
  constructor(private dataservice : DataService,private router: Router) { }

  ngOnInit(): void {
    this.username=localStorage.getItem("username");
  }

  logout() {
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    this.router.navigate(['']);








  }


  goHome() {
    this.router.navigate(['']);
  }
}
