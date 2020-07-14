import {Component, Inject, OnInit} from '@angular/core';
import {FileItem, FileUploader, ParsedResponseHeaders} from 'ng2-file-upload';
import {DomSanitizer} from '@angular/platform-browser';
import {RemoteDataService} from '../../services/remotedata.service';
import {DataService} from '../../services/data.service';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  localImageUrl = '';
  uploadImagesUrls = [];



  constructor(  private dialog: MatDialog, public sanitizer: DomSanitizer, private remoteDataService: RemoteDataService,

                @Inject(MAT_DIALOG_DATA) public data: any, private dataService: DataService, private snackBar: MatSnackBar) {
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.response = '';
  }
  ngOnInit(): void {
    this.uploader = new FileUploader({
      url: this.remoteDataService.serviceURL + 'uploadFile',
      autoUpload: false
    });
    this.uploader.onAfterAddingFile = (fileItem) => {
      let urlIm = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
      //kathe ena pou bazw to kanw pros8hkh kai se ena array
      this.uploadImagesUrls.push(urlIm);
      this.localImageUrl = urlIm;
    };
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
  }

  uploadItem(item: FileItem) {
    item.upload();
  }
  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let data = JSON.parse(response); //success server response
    console.log(this.data);
    if(this.data.coreTaskTemplateId!=null){
      this.dataService.attachCoreTaskDocumentTemplate({
        docId: data.docId,
        coreTaskTemplateId: this.data.coreTaskTemplateId
      }).subscribe(response => {
        if (response.status == 'ok') {
        } else {
          this.snackBar.open('somethign went wrong!', 'x', <MatSnackBarConfig>{duration: 3000});
        }
      });
    }else if(this.data.templateId!=null  ){
      this.dataService.attachDocumentTemplate({
        docId: data.docId,
        templateId: this.data.templateId
      }).subscribe(response => {
        if (response.status == 'ok') {
        } else {
          this.snackBar.open('somethign went wrong!', 'x', <MatSnackBarConfig>{duration: 3000});
        }
      });
    }else{
      this.dataService.attachDocumentTask({
        docId: data.docId,
        taskId: this.data.taskId
      }).subscribe(response => {
        if (response.status == 'ok') {
        } else {
          this.snackBar.open('somethign went wrong!', 'x', <MatSnackBarConfig>{duration: 3000});
        }
      });
    }
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    let error = JSON.parse(response); //error server response
  }
  fileUplaoder() {
    this.uploader.onBeforeUploadItem = (item) => {
      const f: any = new FormData();
      f.append('file', item.file.rawFile);
      item.withCredentials = false;
      item.headers = [{
        name: 'Content-Type',
        value: `multipart/form-data; boundary=`
      },
        {
          name: 'Accept',
          value: 'application/json, text/plain, */*'
        }
      ];
    };
    this.uploader.uploadAll();
  }

  public uploadFiles() {
    console.log(this.uploader.queue);
    this.uploader.uploadAll();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  ok(): void {
 //   this.dialogRef.close();
  }


}
