import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../services/data.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

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
  criteriaMaster;
  constructor(private dataService :DataService,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.label="";
  }
//opId

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


  public updateFilters(label){
    this.label=label;
    this.getCriteriaMaster();
  }



  public emptyTable(){
    this.criteriaMaster=[];
  }

  onPage(event) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      console.log('paged!', event);
    }, 100);
  }



  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  public switchTabChange(event){
    window.dispatchEvent(new Event('resize'));

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
