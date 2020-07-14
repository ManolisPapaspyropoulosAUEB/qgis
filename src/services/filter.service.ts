import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RemoteDataService } from './remotedata.service';
import 'rxjs/Rx';

@Injectable()
export class FilterService {


  public facilitiesArray=[];
  public villagesArray=[];
  public mapRoadsArray=[];
  public mapRoadsArrayAll=[];
  public roadsTab1Cpy=[];
  public facilitiesLimitTab=16;
  public villageLimitTab=16;
  public facilitiesType="Both";
  public villageNameFilter="";
  public firstInit=0;






}
