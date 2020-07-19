import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class ScrollService {
  constructor(private router: Router) {}
  scrollTo(path: string) {
    const { url, elementId } = this.__getUrlAndElementId(path);
    console.log("url : ", url);
    console.log("element id : ", elementId);

    if (url) {
      this.router.navigate([url]);
      if (elementId) {
        this.scrollToElementById(elementId);
      }
    }
  }

  private __getUrlAndElementId(path: string) {
    const splits = path.split('#');
    return {
      url: splits[0],
      elementId: splits[1]
    }
  }

  scrollToElementById(param: string) {
//checkpox
    const className = this.__getElementByClass('datatable-body');
    this.scrollToElement(className,param);



  }

  private __getElementById(id: string): HTMLElement {
    console.log("element id : ", id);
    const element = <HTMLElement>document.querySelector(`#${id}`);
    return element;
  }


  private __getElementByClass(className: string): HTMLElement {
    console.log("element class : ", className);
    const element = <HTMLElement>document.querySelector(`.${className}`);
    return element;
  }//datatable-body



  scrollToElement(myTble:HTMLElement,param) {

    if(param=='mciCbiRates'){
      myTble.scrollTo({
        top: 0,
        left: 5500,
        behavior: 'smooth'
      });

    }else if (param=='c1_location'){
      myTble.scrollTo({
        top: 0,
        left: 2900,
        behavior: 'smooth'
      });
    }else if (param=='init'){
      myTble.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }else if (param=='criteria'){
      myTble.scrollTo({
        top: 0,
        left: 1700,
        behavior: 'smooth'
      });
    }


  }

}
