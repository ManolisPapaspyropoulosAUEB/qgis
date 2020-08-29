import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../services/data.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {UsersComponent} from '../users/users.component';

@Component({
  selector: 'app-core-data',
  templateUrl: './core-data.component.html',
  styleUrls: ['./core-data.component.css']
})
export class CoreDataComponent implements OnInit {
  timeout: any;
  @ViewChild('myTable') table: any;
  label;
  opParam;
  opId;
  tab;
  criteriaMaster;
  role;
  constructor(private dataService :DataService,private snackBar: MatSnackBar) { }
  @ViewChild(UsersComponent) usersComponent: UsersComponent;

  ngOnInit(): void {
    this.tab=0;
    this.role=localStorage.getItem("role");
    this.label="";
  }
 public  getCriteriaMaster(){
    this.dataService.getAllCriteriaMaster({
      "label":this.label
    }).subscribe(response=>{
      this.criteriaMaster=response.data;
      this.opParam=response.opParam;
      this.opId=response.opId;
    });
  }

  toggleExpandRowActivate(e){
    if(e.type == 'click') {
      this.toggleExpandRow(e.row);
    }
  }

  public switchTabChange(event){
    this.tab=event.index;
    window.dispatchEvent(new Event('resize'));

  }

  public updateFilters(label){//

    this.label=label;
    if(this.tab==0){
      this.getCriteriaMaster();
    }else if(this.tab==2){
      this.usersComponent.getUsersFilters(label);
    }

  }



  public emptyTable(){
    this.criteriaMaster=[];
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
    }, 100);
  }



  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
  }




  updateMainCost() { //opId
    this.dataService.updateEstimatedMaintenanceCost({
      "opParam":this.opParam,
      "opId":this.opId
    }).subscribe(response=>{
      this.snackBar.open(response.message, 'x', <MatSnackBarConfig>{duration: 4000});

      this.getCriteriaMaster();
    })
  }
}
