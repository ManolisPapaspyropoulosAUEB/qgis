import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class ScrollService {
  constructor(private router: Router) {}
  scrollTo(path: string) {
    const { url, elementId } = this.__getUrlAndElementId(path);
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
    const className = this.__getElementByClass('datatable-body');
    this.scrollToElement(className,param);
 }




  private __getElementById(id: string): HTMLElement {
    const element = <HTMLElement>document.querySelector(`#${id}`);
    return element;
  }


  private __getElementByClass(className: string): HTMLElement {
    const element = <HTMLElement>document.querySelector(`.${className}`);
    return element;
  }//datatable-body



  scrollToElement(myTble:HTMLElement,param) {
    if(myTble!=null){
      if(param=='mciCbiRates'){
        myTble.scrollTo({
          left: 5500,
          behavior: 'smooth'
        });
      }else if (param=='c1_location'){
        myTble.scrollTo({
          left: 3500,
          behavior: 'smooth'
        });
      }else if (param=='init'){
        myTble.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }else if (param=='criteria'){
        myTble.scrollTo({
          left: 1820,
          behavior: 'smooth'
        });
      }else if(param=='top'){
        myTble.scrollTo({
          top: 2,
          left: 0,
          behavior: 'smooth'
        });
      }
    }else if (param=='sort') {
      myTble.scrollTo({
        top: 0,
        left: 5500,
        behavior: 'smooth'
      });
    }




  }

}
