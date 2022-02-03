import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  TranslateModule, TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { AngularSlickgridModule } from 'angular-slickgrid';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlantListComponent } from './components/plant-list/plant-list.component';
import { PlantSourceListComponent } from './components/plant-list/plant-source-list/plant-source-list.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlantProcessListComponent } from './components/plant-list/plant-process-list/plant-process-list.component';
import { PlantDeviceListComponent } from './components/plant-list/plant-device-list/plant-device-list.component';
import { DicFormComponent } from './components/dic-form/dic-form.component';
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
import { CustomSelectEditorComponent } from './components/editors/custom-select-editor/custom-select-editor.component';
import { ReportParameterGasComponent } from './components/cadaster-report-list/report-parameter-gas/report-parameter-gas.component';
import { PlantProductListComponent } from './components/plant-list/plant-product-list/plant-product-list.component';
import { PlantProductFormComponent } from './components/plant-list/plant-product-list/plant-product-form/plant-product-form.component';
import { ReportProductComponent } from './components/cadaster-report-list/report-product/report-product.component';
import { ReportParameterKoefComponent } from './components/cadaster-report-list/report-parameter-koef/report-parameter-koef.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportCommentEditorComponent } from './components/cadaster-report-list/report-comment-editor/report-comment-editor.component';
import { CommentHistoryComponent } from './components/cadaster-report-list/report-comment-editor/comment-history/comment-history.component';
import { CustomInputEditorComponent } from './components/editors/custom-input-editor/custom-input-editor.component';
import { AngularMaterialModule } from './modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgSelectModule } from '@ng-select/ng-select';
import { LOCATION_INITIALIZED } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// use an Initializer Factory as describe here: https://github.com/ngx-translate/core/issues/517#issuecomment-299637956
export function appInitializerFactory(
  translate: TranslateService,
  injector: Injector
) {
  return () =>
    new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null)
      );
      locationInitialized.then(() => {
        const langToSet = 'ru';
        translate.setDefaultLang('ru');
        translate.use(langToSet).subscribe(
          () => {
            // console.report-info(`Successfully initialized '${langToSet}' language.'`);
          },
          (err) => {
            console.error(
              `Problem with '${langToSet}' language initialization.'`
            );
          },
          () => {
            resolve(null);
          }
        );
      });
    });
}
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
    CustomSelectEditorComponent,
    PlantProductListComponent,
    PlantProductFormComponent,
    ReportProductComponent,
    ReportParameterKoefComponent,
    ReportParameterGasComponent,
    ReportCommentEditorComponent,
    CommentHistoryComponent,
    CustomInputEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularSlickgridModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbDropdownModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,

  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: appInitializerFactory,
    deps: [TranslateService, Injector],
    multi: true,
  },],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
