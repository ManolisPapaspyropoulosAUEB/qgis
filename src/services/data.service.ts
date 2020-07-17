import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RemoteDataService } from './remotedata.service';
import 'rxjs/Rx';

@Injectable()
export class DataService {


  public cases = 0;

  constructor(private http: HttpClient, private remoteDataService: RemoteDataService) {
  }


  register(data) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'register', data).map(
      (response) => {
        return response;
      },
      (error) => {
      }
    );
  }


  get_facilities(data) {

    return this.http.post<any>('http://afggis.synergic.systems/api/get_facilities.php', data)
      .map(
        (response) => {
          return response;
        },
        (error) => {
        }
      );
  }



  getRoadsByParams(data) {


    console.log(data);
    console.log("fe");


    return this.http.post<any>('http://afggis.synergic.systems/api/get_roads.php', data)
      .map(
        (response) => {
          return response;
        },
        (error) => {


        }
      );
  }


  get_province() {
    let query_data : any = {};

    return this.http.post<any>('http://afggis.synergic.systems/api/get_province.php', query_data)
      .map(
        (response) => {
          return response;
        },
        (error) => {

        }
      );
  }


  get_districts(data) {
    // let query_data : any = {};
    // query_data.num_province_code = 1;



    return this.http.post<any>('http://afggis.synergic.systems/api/get_districts.php', data)
      .map(
        (response) => {
          return response;
        },
        (error) => {
        }
      );
  }




  attachDocumentTask(data) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'attachDocumentTask', data).map(
      (response) => {
        return response;
      },
      (error) => {
      }
    );
  }


  attachDocumentTemplate(data) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'attachDocumentTemplate', data).map(
      (response) => {
        return response;
      },
      (error) => {
      }
    );
  }



  attachCoreTaskDocumentTemplate(data) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'attachCoreTaskDocumentTemplate', data).map(
      (response) => {
        return response;
      },
      (error) => {
      }
    );
  }


  login(data) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'login', data).map(
      (response) => {
        return response;
      },
      (error) => {
      }
    );
  }


  getVillages(data) {
    return this.http.post<any>('http://afggis.synergic.systems/api/get_villages.php', data)
      .map(
        (response) => {
          return response;
        },
        (error) => {
        }
      );
  }



  calculateCriteria(data) {
    return this.http.post<any>('http://afggis.synergic.systems/api/calculate_criteria.php', data)
      .map(
        (response) => {
          return response;
        },
        (error) => {
        }
      );
  }




  getUserById(data) {
    return this.http.post<any>(this.remoteDataService.serviceURL + 'getUserById', data).map(
      (response) => {
        return response;
      },
      (error) => {
      }
    );
  }







}
