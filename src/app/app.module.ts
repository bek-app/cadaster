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
import { ReportActualEmissionComponent } from './components/cadaster-report-list/report-actual-emission/report-actual-emission.component';
import { CadasterReportComponent } from './components/cadaster-report/cadaster-report.component';
import { CadasterReportFormComponent } from './components/cadaster-report/cadaster-report-form/cadaster-report-form.component';
import { ReportParameterCalcComponent } from './components/cadaster-report-list/report-parameter-calc/report-parameter-calc.component';
import { EditorNgSelectComponent } from './components/editors/editor-ng-select/editor-ng-select.component';
import { ReportParameterGasComponent } from './components/cadaster-report-list/report-parameter-gas/report-parameter-gas.component';
import { PlantProductListComponent } from './components/plant-list/plant-product-list/plant-product-list.component';
import { PlantProductFormComponent } from './components/plant-list/plant-product-list/plant-product-form/plant-product-form.component';
import { ReportProductComponent } from './components/cadaster-report-list/report-product/report-product.component';
import { ReportParameterKoefComponent } from './components/cadaster-report-list/report-parameter-koef/report-parameter-koef.component';
import { EditorTextAreaComponent } from './components/editors/editor-textarea/editor-textarea.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
 
@NgModule({
  declarations: [
    AppComponent,
    PlantListComponent,
    PlantSourceListComponent,
    PlantProcessListComponent,
    PlantDeviceListComponent,
    DicFormComponent,
    DeviceFormComponent,
    ProcessFormComponent,
    PlantFormComponent,
    SourceFormComponent,
    PlantSamplingListComponent,
    SamplingFormComponent,
    CadasterReportListComponent,
    ReportActualEmissionComponent,
    CadasterReportComponent,
    CadasterReportFormComponent,
    ReportParameterCalcComponent,
    EditorNgSelectComponent,
    PlantProductListComponent,
    PlantProductFormComponent,
    ReportProductComponent,
    ReportParameterKoefComponent,
    ReportParameterGasComponent,
    EditorTextAreaComponent,
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
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
