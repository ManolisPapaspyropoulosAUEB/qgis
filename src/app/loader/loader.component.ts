import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  constructor(public router: Router) { }
  ngOnInit(): void {
    setTimeout(() => {
      window.location.reload();

    }, 3000);
  }


}


