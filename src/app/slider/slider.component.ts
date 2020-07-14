import {
  Component,
  OnInit
} from '@angular/core';
import {
  trigger,
  transition,
  query,
  style,
  animate,
  group
} from '@angular/animations';



@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  animations: [
    trigger('slider', [
      transition(":increment", group([
        query(':enter', [
          style({
            left: '100%'
          }),
          animate('0.5s ease-out', style('*'))
        ]),
        query(':leave', [
          animate('0.5s ease-out', style({
            left: '-100%'
          }))
        ])
      ])),
      transition(":decrement", group([
        query(':enter', [
          style({
            left: '-100%'
          }),
          animate('0.5s ease-out', style('*'))
        ]),
        query(':leave', [
          animate('0.5s ease-out', style({
            left: '100%'
          }))
        ])
      ])),
    ])
  ],

  styleUrls: ['./slider.component.css']

})
export class SliderComponent implements OnInit{


  private _images: string[] = ['https://www.gazzetta.gr/sites/default/files/styles/scale_n_crop_812x457/public/article/2020-06/el_arampi_olympiakos.jpg?itok=BNO_3RGz',
    'https://www.fosonline.gr/media/news/2020/06/07/96955/main/olympiakos_panuguriko.jpg',
    'https://www.tanea.gr/wp-content/uploads/2019/07/olympiakos-champions-league-logo-sima.jpg'
  ];
  selectedIndex: number = 0;

  imagesSize = 0;




  get images() {
    return [this._images[this.selectedIndex]];
  }

  previous() {
    this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
  }

  next() {
    this.selectedIndex = Math.min(this.selectedIndex + 1, this._images.length - 1);
  }

  ngOnInit(): void {
    this.imagesSize=this._images.length;
  }

}
