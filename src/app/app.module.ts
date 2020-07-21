import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCard, MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {RegisterComponent} from './register/register.component';
import {RouterModule, Routes} from '@angular/router';
import {
  AuthGuardService as AuthGuard, AuthGuardService
} from '../services/auth-guard.service';
import {MatRadioModule} from '@angular/material/radio';

import {AuthService} from '../services/auth.service';
import {LoginComponent} from './login/login.component';
import {DataService} from '../services/data.service';
import {HttpClientModule} from '@angular/common/http';
import {RemoteDataService} from '../services/remotedata.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {HomeConsumerComponent} from './home-consumer/home-consumer.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {PortalModule} from '@angular/cdk/portal';
import {MatTreeModule} from '@angular/material/tree';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSelectModule} from '@angular/material/select';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {AddDCDialog, FacilitiesComponent} from './facilities/facilities.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';



import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatStepperModule} from '@angular/material/stepper';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatBadgeModule} from '@angular/material/badge';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {CdkTreeModule} from '@angular/cdk/tree';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {A11yModule} from '@angular/cdk/a11y';
import {MatMenuModule} from '@angular/material/menu';
import {ProducerHomeComponent} from './producer-home/producer-home.component';
import {ProductComponent} from './product/product.component';
import {ProducerProfileComponent} from './producer-profile/producer-profile.component';
import {ConsumerProfileComponent} from './consumer-profile/consumer-profile.component';
import {TimelineProducerComponent} from './timeline-producer/timeline-producer.component';
import {ProductsComponent} from './products/products.component';
import { UnitProductComponent } from './products/unit-product/unit-product.component';
import { FileuploadComponent } from './fileupload/fileupload.component';
import {FileUploadModule} from 'ng2-file-upload';
import { SliderComponent } from './slider/slider.component';
import {EditRoadDialog, QgisMapComponent} from './qgis-map/qgis-map.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {AngularMultiSelectModule} from 'angular2-multiselect-dropdown';
import {FilterService} from '../services/filter.service';
import {VillagesComponent} from './villages/villages.component';
import { CoreDataComponent } from './core-data/core-data.component';
import {ExcelPdfExporterService} from './services/excel-pdf-exporter.service';
import {NgxSelectModule} from 'ngx-select-ex';



const routes: Routes = [

  {path: '', component: QgisMapComponent},
  {
    path: 'qgis',
    component: QgisMapComponent
  },





  // {path: '', component: LoginComponent},
  //
  // {
  //   path: 'login',
  //   component: LoginComponent
  // },
  //
  //
  // {
  //   path: 'register',
  //   component: RegisterComponent
  // },
  //
  //
  // {
  //   path: 'homeConsumer',
  //   component: HomeConsumerComponent
  // },
  // {
  //   path: 'homeProducer',
  //   component: ProducerHomeComponent,
  //   children: [
  //
  //     {
  //       path: 'products',
  //       component: ProductsComponent
  //
  //     },
  //     {
  //       path: 'unitproduct',
  //       component: UnitProductComponent
  //
  //     }
  //   ]
  //
  // }
  //

];







@NgModule({
  declarations: [
    EditRoadDialog,
    AddDCDialog,
    AppComponent,
    RegisterComponent,
    VillagesComponent,
    FacilitiesComponent,
    LoginComponent,
    HomeConsumerComponent,
    ProducerHomeComponent,
    ProductComponent,
    ProducerProfileComponent,
    ConsumerProfileComponent,
    TimelineProducerComponent,
    ProductsComponent,
    UnitProductComponent,
    FileuploadComponent,
    SliderComponent,
    QgisMapComponent,
    CoreDataComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule
  ],

  imports: [
    NgxSelectModule,
    Ng2SearchPipeModule,
    FormsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    HttpClientModule,
    MatButtonModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    A11yModule,
    ClipboardModule,

    FormsModule,
    FileUploadModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,
    NgxDatatableModule,
    MatRadioModule,
    AngularMultiSelectModule,
    BrowserAnimationsModule


  ],
  entryComponents: [
    EditRoadDialog,
    AddDCDialog
  ],


  providers: [AuthGuardService, AuthService, DataService, RemoteDataService,FilterService,ExcelPdfExporterService,

    {provide:MAT_DIALOG_DATA,useValue: {}}

  ],
  bootstrap: [AppComponent],

})
export class AppModule {
}
