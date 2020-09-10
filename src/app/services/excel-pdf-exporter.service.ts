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
    this.tempBody2=[];
    let itemNew2: any[];
    this.temp = [
      'OSM_ID',
      'FCLASS',
      'LVRR_ID',
      'NAME',
      'REF',
      'COMMENTS ON CONNECTIONS',
      'ONEWAY',
      'MAXSPEED',
      'LAYER',
      'BRIGDE',
      'TUNNEL',
      'DISTRICT',
      'SOURCE',
      'DISTRICT CODE',
      'LENGTH IN METRES',
      'POPULATION SERVED',
      'FACILITIES SERVED',
      'ACCESS TO GCsRMs' ,
      'FARM TO THE MARKET',
      'AGRICUTULAR FACILITIES',
      'LINKS TO MAJOR ACTIVITIES SERVED',
      'NUMBER OF CONNECTIONS',
      'C1_SCORE',
      'C2_SCORE',
      'C3_SCORE',
      'C4_SCORE',
      'C5_SCORE',
      'C6_SCORE ',
      'C7_SCORE',
      'C8_SCORE',
      'C9_SCORE',
      'C10_SCORE',
      'C11_SCORE',
      'C12_SCORE',
      'C13_SCORE',
      'C14_SCORE',
      'C15_SCORE',
      'MCA',
      'CBI_ROUTINE',
      'CBI_PERIODIC'
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
        [element.accessToGCsRMs,230],
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
        element.cbiRoutine,
        element.cbiPeriodic
      ];
      this.tempBody2.push(this.temp);
    });
    var docDefinition = {
      pageOrientation: 'landscape',
      pageSize: 'A2',

      pageMargins: [170, 90, 90, 5],
      content: [
        {
          table: {
            pageSize: 'A2',
            headerRows: 1,
            body: this.tempBody2
          }
        }
      ],
      defaultStyle: {
        fontSize: 4,
        bold: true
      }
    };
    pdfMake.createPdf(docDefinition).download();
  }




  public convertAsXls(roadsTab1): void {//
    const workbook = new Excel.Workbook();
    var sheet = Math.floor(Math.random() * Math.floor(900));


    let worksheet = this.workbook.addWorksheet('My Sheet'+sheet, {
      properties: {
        defaultRowHeight: 150,
      }
    });
    worksheet.columns = [
      {header: 'OSM_ID', key: 'osm_id', width: 14},
      {header: 'CODE', key: 'code', width: 14},
      {header: 'FCLASS', key: 'fclass', width: 14},
      {header: 'LVRR_ID', key: 'LVRR_ID', width: 14},
      {header: 'NAME', key: 'name', width: 55},
      {header: 'REF', key: 'ref', width: 14},
      {header: 'COMMENTS ON CONNECTIONS', key: 'commentsOnConnections', width: 14},
      {header: 'ONEWAY', key: 'oneway', width: 14},
      {header: 'MAXSPEED', key: 'maxspeed', width: 14},
      {header: 'LAYER', key: 'layer', width: 14},
      {header: 'BRIGDE', key: 'bridge', width: 14},
      {header: 'TUNNEL', key: 'tunnel', width: 14},
      {header: 'DISTRICT', key: 'district', width: 14},
      {header: 'SOURCE', key: 'source', width: 14},
      {header: 'DISTRICT CODE', key: 'districtCode', width: 14},
      {header: 'LENGTH IN METRES', key: 'lengthInMetres', width: 14},
      {header: 'POPULATION SERVED', key: 'populationServed', width: 14},
      {header: 'FACILITIES SERVED', key: 'facilitiesServed', width: 14},
      {header: 'ACCESS TO GCsRMs', key: 'accessToGCsRMs', width: 14},
      {header: 'FARM TO THE MARKET', key: 'farmToTheMarket', width: 14},
      {header: 'AGRICUTULAR FACILITIES', key: 'agriculturalFacilities', width: 14},
      {header: 'LINKS TO MAJOR ACTIVITIES SERVED', key: 'linksToMajorActivityCentres', width: 14},
      {header: 'NUMBER OF CONNECTIONS', key: 'numberOfConnections', width: 14},
      {header: 'C1_SCORE', key: 'c1Score', width: 14},
      {header: 'C2_SCORE', key: 'c2Score', width: 14},
      {header: 'C3_SCORE', key: 'c3Score', width: 14},
      {header: 'C4_SCORE', key: 'c4Score', width: 14},
      {header: 'C5_SCORE', key: 'c5Score', width: 14},
      {header: 'C6_SCORE', key: 'c6Score', width: 14},
      {header: 'C7_SCORE', key: 'c7Score', width: 14},
      {header: 'C8_SCORE', key: 'c8Score', width: 14},
      {header: 'C9_SCORE', key: 'c9Score', width: 14},
      {header: 'C10_SCORE', key: 'c10Score', width: 14},
      {header: 'C11_SCORE', key: 'c11Score', width: 14},
      {header: 'C12_SCORE', key: 'c12Score', width: 14},
      {header: 'C13_SCORE', key: 'c13Score', width: 14},
      {header: 'C14_SCORE', key: 'c14Score', width: 14},
      {header: 'C15_SCORE', key: 'c15Score', width: 14},
      {header: 'MCA', key: 'mca', width: 14},
      {header: 'CBI_ROUTINE', key: 'cbiRoutine', width: 14},
      {header: 'CBI_PERIODIC', key: 'cbiPeriodic', width: 14},
    ];
    worksheet.properties.defaultRowHeight = 12;
    let itemNew2: any[];
    itemNew2 = roadsTab1;
    itemNew2.forEach(element => {
      worksheet.addRow({
        osm_id:element.osm_id,
        code:element.code,
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
        c8Score :element.c8Score,
        c9Score :element.c9Score,
        c10Score:element.c10Score,
        c11Score:element.c11Score,
        c12Score:element.c12Score,
        c13Score:element.c13Score,
        c14Score:element.c14Score,
        c15Score:element.c15Score,
        mca:element.mca,
        cbiRoutine:element.cbiRoutine,
        cbiPeriodic:element.cbiPeriodic
      });
    });


    this.workbook.xlsx.writeBuffer().then(data => {
      const blob = new Blob([data], { type: this.blobType });
      FileSaver.saveAs(blob, 'ROADS.xlsx');
    });
  }




}


