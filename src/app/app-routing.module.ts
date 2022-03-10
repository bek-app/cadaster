import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PlantDeviceListComponent } from './components/plant-list/plant-device-list/plant-device-list.component'
import { PlantListComponent } from './components/plant-list/plant-list.component'
import { PlantProcessListComponent } from './components/plant-list/plant-process-list/plant-process-list.component'
import { PlantSamplingListComponent } from './components/plant-list/plant-sampling-list/plant-sampling-list.component'
import { PlantSourceListComponent } from './components/plant-list/plant-source-list/plant-source-list.component'
import { CadasterReportListComponent } from './components/cadaster-report-list/cadaster-report-list.component'
import { PlantProductListComponent } from './components/plant-list/plant-product-list/plant-product-list.component'
import { ReportActualEmissionComponent } from './components/cadaster-report-list/report-actual-emission/report-actual-emission.component'
import { CadasterReportComponent } from './components/cadaster-report/cadaster-report.component'
import { ReportParameterCalcComponent } from './components/cadaster-report-list/report-parameter-calc/report-parameter-calc.component'
import { DicUnitResolver } from './services/dic-unit.resolver'
import { ReportParameterGasComponent } from './components/cadaster-report-list/report-parameter-gas/report-parameter-gas.component'
import { ReportProductComponent } from './components/cadaster-report-list/report-product/report-product.component'
import { ReportParameterKoefComponent } from './components/cadaster-report-list/report-parameter-koef/report-parameter-koef.component'
import { CadasterReportCheckComponent } from './components/cadaster-report-check/cadaster-report-check.component'
import { CdrReportCheckListsComponent } from './components/cdr-report-check-list/cdr-report-check-list.component'
import { PlantPlannedChangesComponent } from './components/plant-list/plant-planned-changes/plant-planned-changes.component'
import { PlantActivityListComponent } from './components/plant-list/plant-activity-list/plant-activity-list.component'
import { ReportActivityComponent } from './components/cadaster-report-list/report-activity/report-activity.component'
import { ReportActivityChangeComponent } from './components/cadaster-report-list/report-activity-change/report-activity-change.component'
import { ReportCarbonUnitComponent } from './components/cadaster-report-list/report-carbon-unit/report-carbon-unit.component'
import { ReportPlanComponent } from './components/cadaster-report-list/report-plan/report-plan.component'

import { LoginComponent } from './components/authentication/login/login.component'
import { RegistrationComponent } from './components/authentication/registration/registration.component'
import { FullComponent } from './layouts/full/full.component'
import { CommonComponent } from './layouts/common/common.component'
import { AuthGuard } from './guards/auth.guard'
import { UserListComponent } from './components/administration/user-list/user-list.component'
import { UserFormComponent } from './components/administration/user-form/user-form.component'

const routes: Routes = [
  { path: '', redirectTo: 'common/plant', pathMatch: 'full' },

  {
    path: 'auth',
    component: FullComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'registration',
        component: RegistrationComponent,
      },
    ],
  },
  {
    path: 'common',
    component: CommonComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'administration',
        children: [
          {
            path: 'users',
            component: UserListComponent,
          },
          {
            path: 'user',
            component: UserFormComponent,
          },
        ],
      },
      {
        path: 'plant',
        component: PlantListComponent,
        children: [
          { path: '', redirectTo: 'source', pathMatch: 'full' },
          {
            path: 'source',
            component: PlantSourceListComponent,
          },
          {
            path: 'planned-changes',
            component: PlantPlannedChangesComponent,
          },
          {
            path: 'process',
            component: PlantProcessListComponent,
          },
          {
            path: 'device',
            component: PlantDeviceListComponent,
          },
          {
            path: 'sampling',
            component: PlantSamplingListComponent,
          },
          {
            path: 'product',
            component: PlantProductListComponent,
          },
          {
            path: 'activity',
            component: PlantActivityListComponent,
          },
        ],
      },
      {
        path: 'cadaster-report',
        component: CadasterReportComponent,
      },
      {
        path: 'cadaster-report-list/:id',
        component: CadasterReportListComponent,
        children: [
          { path: '', redirectTo: 'actual-emission', pathMatch: 'full' },
          { path: 'actual-emission', component: ReportActualEmissionComponent },
          {
            path: 'parameter-calc',
            component: ReportParameterCalcComponent,
            resolve: { dicUnit: DicUnitResolver },
          },
          {
            path: 'parameter-gas',
            component: ReportParameterGasComponent,
            resolve: { dicUnit: DicUnitResolver },
          },
          {
            path: 'report-product',
            component: ReportProductComponent,
          },
          {
            path: 'parameter-koef',
            component: ReportParameterKoefComponent,
            resolve: { dicUnit: DicUnitResolver },
          },
          {
            path: 'report-activity',
            component: ReportActivityComponent,
          },
          {
            path: 'report-activity-change',
            component: ReportActivityChangeComponent,
          },
          {
            path: 'report-carbon-unit',
            component: ReportCarbonUnitComponent,
          },
          {
            path: 'report-plan',
            component: ReportPlanComponent,
          },
        ],
      },
      {
        path: 'cadaster-report-check',
        component: CadasterReportCheckComponent,
      },
      {
        path: 'cdr-report-check-list/:id',
        component: CdrReportCheckListsComponent,
        children: [
          { path: '', redirectTo: 'actual-emission', pathMatch: 'full' },
          { path: 'actual-emission', component: ReportActualEmissionComponent },
          {
            path: 'parameter-calc',
            component: ReportParameterCalcComponent,
            resolve: { dicUnit: DicUnitResolver },
          },
          {
            path: 'parameter-gas',
            component: ReportParameterGasComponent,
            resolve: { dicUnit: DicUnitResolver },
          },
          {
            path: 'report-product',
            component: ReportProductComponent,
          },
          {
            path: 'parameter-koef',
            component: ReportParameterKoefComponent,
            resolve: { dicUnit: DicUnitResolver },
          },
        ],
      },
    ],
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
      paramsInheritanceStrategy: 'always',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
