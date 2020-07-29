import { Pipe, PipeTransform } from '@angular/core';
import {RemoteDataService} from '../../services/remotedata.service';

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  constructor(private service : RemoteDataService){}

  transform(value: any, args?: any): any {
    //if(value && value.indexOf('demo_property') < 0){
    console.log(value);
    return this.service.imageURL+'?docId='+ value;
   // } else return value;

  }

}
