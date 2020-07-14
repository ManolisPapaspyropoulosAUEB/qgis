import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-unit-product',
  templateUrl: './unit-product.component.html',
  styleUrls: ['./unit-product.component.css']
})
export class UnitProductComponent implements OnInit {
  formGroup: FormGroup;
  productName;
  description;
  reserve;
  originalPrice;
  selectedFile: File;

  imageList: string[] = ['https://images.com/img1.jpg',
    'https://images.com/img2.jpg'] // etc

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      productName: ["", Validators.required],
      description: ["", Validators.required],
      category: ["", Validators.required],
      reserve: [0, Validators.required],
      originalPrice: [0, Validators.required]



    });
  }

  get f() {
    return this.formGroup.controls;
  }


  onSubmit() {

    if (this.formGroup.invalid) {
      return;
    }


  }


  onFileChanged(event) {
    this.selectedFile = event.target.files[0]
  }

  onUpload() {
    // upload code goes here
  }
}
