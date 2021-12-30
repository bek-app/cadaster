import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlantListComponent } from './components/plant-list/plant-list.component';
import { PlantSourceListComponent } from './components/plant-list/plant-source-list/plant-source-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { PlantProcessListComponent } from './components/plant-list/plant-process-list/plant-process-list.component';
import { PlantDeviceListComponent } from './components/plant-list/plant-device-list/plant-device-list.component';
import { DicFormComponent } from './components/dic-form/dic-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { DeviceFormComponent } from './components/plant-list/plant-device-list/device-form/device-form.component';
import { ProcessFormComponent } from './components/plant-list/plant-process-list/process-form/process-form.component';
import { PlantFormComponent } from './components/plant-list/plant-form/plant-form.component';
 import { SourceFormComponent } from './components/plant-list/plant-source-list/source-form/source-form.component';
import { PlantSamplingListComponent } from './components/plant-list/plant-sampling-list/plant-sampling-list.component';
import { SamplingFormComponent } from './components/plant-list/plant-sampling-list/sampling-form/sampling-form.component';
  import { CadasterReportListComponent } from './components/cadaster-report-list/cadaster-report-list.component';
import { CadasterReportFormComponent } from './components/cadaster-report-list/cadaster-report-form/cadaster-report-form.component';
import { ProductsComponent } from './components/plant-list/products/products.component';

@NgModule({
  declarations: [
    AppComponent,
    PlantListComponent,
    PlantSourceListComponent,
    PlantProcessListComponent,
    PlantDeviceListComponent,
    PlantDeviceListComponent,
    PlantProcessListComponent,
    DicFormComponent,
    DeviceFormComponent,
    ProcessFormComponent,
    PlantFormComponent,
     SourceFormComponent,
     PlantSamplingListComponent,
     SamplingFormComponent,
     CadasterReportListComponent,
     CadasterReportFormComponent,
     ProductsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularSlickgridModule.forRoot(),
    TranslateModule.forRoot(),
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
