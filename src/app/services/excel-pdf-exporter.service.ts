import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import * as ExcelProper from 'exceljs';
import * as Excel from 'exceljs/dist/exceljs.min.js';
import * as FileSaver from 'file-saver';




@Injectable()
export class ExcelPdfExporterService {

  constructor() { }

  temp = [];
  tempBody2 = [];
  workbook: ExcelProper.Workbook = new Excel.Workbook();//
  blobType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';



  public convertAsPdf(roadsTab1) { //https://pdfmake.github.io/docs/document-definition-object/page/
    let itemNew2: any[];
    this.temp = [
      'osm_id',
      'fclass',
      'LVRR_ID',
      'name',
      'ref',
      'commentsOnConnections',
      'oneway',
      'maxspeed',
      'layer',
      'bridge',
      'tunnel',
      'district',
      'source',
      'districtCode',
      'lengthInMetres',
      'populationServed',
      'facilitiesServed',
      'accessToGCsRMs',
      'farmToTheMarket',
      'agriculturalFacilities',
      'linksToMajorActivityCentres',
      'numberOfConnections',
      'c1Score',
      'c2Score',
      'c3Score',
      'c4Score',
      'c5Score',
      'c6Score',
      'c7Score',
      'c8Score',
      'c9Score',
      'c10Score',
      'c11Score',
      'c12Score',
      'c13Score',
      'c14Score',
      'c15Score',
      'MCA',
      'CBI'
    ];
    this.tempBody2.push(this.temp);
    itemNew2 = roadsTab1;
    itemNew2.forEach(element => {
      this.temp = [
        element.osm_id,
        element.fclass,
        element.LVRR_ID,
        element.name,
        element.ref,
        element.commentsOnConnections,
        element.oneway,
        element.maxspeed,
        element.layer,
        element.bridge,
        element.tunnel,
        element.district,
        element.source,
        element.districtCode,
        element.lengthInMetres,
        element.populationServed,
        element.facilitiesServed,
        element.accessToGCsRMs,
        element.farmToTheMarket,
        element.agriculturalFacilities,
        element.linksToMajorActivityCentres,
        element.numberOfConnections,
        element.c1Score,
        element.c2Score,
        element.c3Score,
        element.c4Score,
        element.c5Score,
        element.c6Score,
        element.c7Score,
        element.c8Score,
        element.c9Score,
        element.c10Score,
        element.c11Score,
        element.c12Score,
        element.c13Score,
        element.c14Score,
        element.c15Score,
        element.mca,
        element.cbi
      ];
      this.tempBody2.push(this.temp);
    });
    var docDefinition = {
      pageOrientation: 'landscape',
      pageSize: 'A3',
      pageMargins: [5, 50, 50, 0],
      content: [
        {
          table: {
            pageSize: 'A5',
            headerRows: 1,
            body: this.tempBody2
          }
        }
      ],
      defaultStyle: {
        fontSize: 4.2,
        bold: true
      }
    };
    pdfMake.createPdf(docDefinition).download();
  }


  public convertAsXls(roadsTab1): void {//
    const workbook = new Excel.Workbook();

    let worksheet = this.workbook.addWorksheet('My Sheet', {
      properties: {
        defaultRowHeight: 150,
      }
    });
    worksheet.columns = [
      {header: 'osm_id', key: 'osm_id', width: 14},
      {header: 'code', key: 'code', width: 14},
      {header: 'fclass', key: 'fclass', width: 14},
      {header: 'LVRR_ID', key: 'LVRR_ID', width: 14},
      {header: 'name', key: 'name', width: 55},
      {header: 'ref', key: 'ref', width: 14},
      {header: 'commentsOnConnections', key: 'comments On Connections', width: 14},
      {header: 'oneway', key: 'oneway', width: 14},
      {header: 'maxspeed', key: 'maxspeed', width: 14},
      {header: 'layer', key: 'layer', width: 14},
      {header: 'bridge', key: 'bridge', width: 14},
      {header: 'tunnel', key: 'tunnel', width: 14},
      {header: 'district', key: 'district', width: 14},
      {header: 'source', key: 'source', width: 14},
      {header: 'districtCode', key: 'districtCode', width: 14},
      {header: 'lengthInMetres', key: 'lengthInMetres', width: 14},
      {header: 'populationServed', key: 'populationServed', width: 14},
      {header: 'facilitiesServed', key: 'facilitiesServed', width: 14},
      {header: 'accessToGCsRMs', key: 'accessToGCsRMs', width: 14},
      {header: 'farmToTheMarket', key: 'farmToTheMarket', width: 14},
      {header: 'agriculturalFacilities', key: 'agriculturalFacilities', width: 14},
      {header: 'linksToMajorActivityCentres', key: 'linksToMajorActivityCentres', width: 14},
      {header: 'numberOfConnections', key: 'numberOfConnections', width: 14},
      {header: 'c1Score', key: 'c1Score', width: 14},
      {header: 'c2Score', key: 'c2Score', width: 14},
      {header: 'c3Score', key: 'c3Score', width: 14},
      {header: 'c4Score', key: 'c4Score', width: 14},
      {header: 'c5Score', key: 'c5Score', width: 14},
      {header: 'c6Score', key: 'c6Score', width: 14},
      {header: 'c7Score', key: 'c7Score', width: 14},
      {header: 'c8Score', key: 'c8Score', width: 14},
      {header: 'c9Score', key: 'c9Score', width: 14},
      {header: 'c10Score', key: 'c10Score', width: 14},
      {header: 'c11Score', key: 'c11Score', width: 14},
      {header: 'c12Score', key: 'c12Score', width: 14},
      {header: 'c13Score', key: 'c13Score', width: 14},
      {header: 'c14Score', key: 'c14Score', width: 14},
      {header: 'c15Score', key: 'c15Score', width: 14},
      {header: 'mca', key: 'mca', width: 14},
      {header: 'cbi', key: 'cbi', width: 14},
    ];
    worksheet.properties.defaultRowHeight = 12;
    let itemNew2: any[];
    itemNew2 = roadsTab1;
    itemNew2.forEach(element => {
      worksheet.addRow({
        osm_id:element.osm_id,
        fclass:element.fclass,
        LVRR_ID:element.LVRR_ID,
        name:element.name,
        ref:element.ref,
        commentsOnConnections:element.commentsOnConnections,
        oneway:element.oneway,
        maxspeed:element.maxspeed,
        layer:element.layer,
        bridge:element.bridge,
        tunnel:element.tunnel,
        district:element.district,
        source:element.source,
        districtCode:element.districtCode,
        lengthInMetres:element.lengthInMetres,
        populationServed:element.populationServed,
        facilitiesServed:element.facilitiesServed,
        accessToGCsRMs:element.accessToGCsRMs,
        farmToTheMarket:element.farmToTheMarket,
        agriculturalFacilities:element.agriculturalFacilities,
        linksToMajorActivityCen:element.linksToMajorActivityCen,
        numberOfConnections:element.numberOfConnections,
        c1Score:element.c1Score,
        c2Score:element.c2Score,
        c3Score:element.c3Score,
        c4Score:element.c4Score,
        c5Score:element.c5Score,
        c6Score:element.c6Score,
        c7Score:element.c7Score,
        c8Score:element.c8Score,
        c9Score:element.c9Score,
        c10Score:element.c10Score,
        c11Score:element.c11Score,
        c12Score:element.c12Score,
        c13Score:element.c13Score,
        c14Score:element.c14Score,
        c15Score:element.c15Score,
        mca:element.mca,
        cbi:element.cbi
      });
    });


    this.workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: this.blobType });
      console.log(data);
      console.log(blob);
      // this.excelService.exportAsExcelFile(data, 'sample');
      FileSaver.saveAs(blob, 'ROADS.xlsx');
    });
  }




}


