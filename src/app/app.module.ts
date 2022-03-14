import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PlantListComponent } from './components/plant-list/plant-list.component'
import { PlantSourceListComponent } from './components/plant-list/plant-source-list/plant-source-list.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { PlantProcessListComponent } from './components/plant-list/plant-process-list/plant-process-list.component'
import { PlantDeviceListComponent } from './components/plant-list/plant-device-list/plant-device-list.component'
import { DicFormComponent } from './components/dic-form/dic-form.component'
import { DeviceFormComponent } from './components/plant-list/plant-device-list/device-form/device-form.component'
import { ProcessFormComponent } from './components/plant-list/plant-process-list/process-form/process-form.component'
import { PlantFormComponent } from './components/plant-list/plant-form/plant-form.component'
import { SourceFormComponent } from './components/plant-list/plant-source-list/source-form/source-form.component'
import { PlantSamplingListComponent } from './components/plant-list/plant-sampling-list/plant-sampling-list.component'
import { SamplingFormComponent } from './components/plant-list/plant-sampling-list/sampling-form/sampling-form.component'
import { CadasterReportListComponent } from './components/cadaster-report-list/cadaster-report-list.component'
import { ReportActualEmissionComponent } from './components/cadaster-report-list/report-actual-emission/report-actual-emission.component'
import { CadasterReportComponent } from './components/cadaster-report/cadaster-report.component'
import { CadasterReportFormComponent } from './components/cadaster-report/cadaster-report-form/cadaster-report-form.component'
import { ReportParameterCalcComponent } from './components/cadaster-report-list/report-parameter-calc/report-parameter-calc.component'
import { CustomSelectEditorComponent } from './components/editors/custom-select-editor/custom-select-editor.component'
import { ReportParameterGasComponent } from './components/cadaster-report-list/report-parameter-gas/report-parameter-gas.component'
import { PlantProductListComponent } from './components/plant-list/plant-product-list/plant-product-list.component'
import { PlantProductFormComponent } from './components/plant-list/plant-product-list/plant-product-form/plant-product-form.component'
import { ReportProductComponent } from './components/cadaster-report-list/report-product/report-product.component'
import { ReportParameterKoefComponent } from './components/cadaster-report-list/report-parameter-koef/report-parameter-koef.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReportCommentEditorComponent } from './components/cadaster-report-list/report-comment-editor/report-comment-editor.component'
import { CommentHistoryComponent } from './components/cadaster-report-list/report-comment-editor/comment-history/comment-history.component'
import { CustomInputEditorComponent } from './components/editors/custom-input-editor/custom-input-editor.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { CadasterReportCheckComponent } from './components/cadaster-report-check/cadaster-report-check.component'
import { CdrReportCheckListsComponent } from './components/cdr-report-check-list/cdr-report-check-list.component'
import { PlantPlannedChangesComponent } from './components/plant-list/plant-planned-changes/plant-planned-changes.component'
import { PlannedChangesFormComponent } from './components/plant-list/plant-planned-changes/planned-changes-form/planned-changes-form.component'
import { PlantActivityListComponent } from './components/plant-list/plant-activity-list/plant-activity-list.component'
import { ActivityFormComponent } from './components/plant-list/plant-activity-list/activity-form/activity-form.component'
import { ReportActivityComponent } from './components/cadaster-report-list/report-activity/report-activity.component'
import { ReportActivityChangeComponent } from './components/cadaster-report-list/report-activity-change/report-activity-change.component'
import { ActivityChangeFormComponent } from './components/cadaster-report-list/report-activity-change/activity-change-form/activity-change-form.component'
import { ReportCarbonUnitComponent } from './components/cadaster-report-list/report-carbon-unit/report-carbon-unit.component'
import { ReportPlanComponent } from './components/cadaster-report-list/report-plan/report-plan.component'
import { PlanFormComponent } from './components/cadaster-report-list/report-plan/plan-form/plan-form.component'
import { LoginComponent } from './components/authentication/login/login.component'
import { RegistrationComponent } from './components/authentication/registration/registration.component'
import { FullComponent } from './layouts/full/full.component'
import { CommonComponent } from './layouts/common/common.component'
import { AuthInterceptor } from './interceptor/authentication.inteceptor'
import { AuthGuard } from './guards/auth.guard'
import { UserListComponent } from './components/administration/user-list/user-list.component'
import { UserFormComponent } from './components/administration/user-form/user-form.component'
import { AngularMaterialModule } from './modules/material/material.module'
import { CustomTranslateModule } from './modules/translate/translate.module'
import { SlickGridModule } from './modules/slickgrid/slickgrid.module'
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component'
import { MtxGridModule } from '@ng-matero/extensions/grid'
import { MtxSelectModule } from '@ng-matero/extensions/select'
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
    CadasterReportCheckComponent,
    CdrReportCheckListsComponent,
    PlantPlannedChangesComponent,
    PlannedChangesFormComponent,
    PlantActivityListComponent,
    ActivityFormComponent,
    ReportActivityComponent,
    ReportActivityChangeComponent,
    ActivityChangeFormComponent,
    ReportCarbonUnitComponent,
    ReportPlanComponent,
    PlanFormComponent,
    LoginComponent,
    RegistrationComponent,
    FullComponent,
    CommonComponent,
    UserListComponent,
    UserFormComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    CustomTranslateModule,
    SlickGridModule,
    MtxGridModule,
    MtxSelectModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
