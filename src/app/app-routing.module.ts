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

const routes: Routes = [
  { path: '', redirectTo: 'plant', pathMatch: 'full' },

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
