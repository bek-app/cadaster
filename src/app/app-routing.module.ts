import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantDeviceListComponent } from './components/plant-list/plant-device-list/plant-device-list.component';
import { PlantListComponent } from './components/plant-list/plant-list.component';
import { PlantProcessListComponent } from './components/plant-list/plant-process-list/plant-process-list.component';
import { PlantSamplingListComponent } from './components/plant-list/plant-sampling-list/plant-sampling-list.component';
import { PlantSourceListComponent } from './components/plant-list/plant-source-list/plant-source-list.component';
import { CadasterReportListComponent } from './components/cadaster-report-list/cadaster-report-list.component';
import { PlantProductListComponent } from './components/plant-list/plant-product-list/plant-product-list.component';
import { ReportActualEmissionComponent } from './components/cadaster-report-list/report-actual-emission/report-actual-emission.component';
import { CadasterReportComponent } from './components/cadaster-report/cadaster-report.component';
import { ReportParameterCalcComponent } from './components/cadaster-report-list/report-parameter-calc/report-parameter-calc.component';
import { DicUnitResolverService } from './services/dic-unit-resolver.service';
import { ReportParameterGasComponent } from './components/cadaster-report-list/report-parameter-gas/report-parameter-gas.component';
import { ReportProductComponent } from './components/cadaster-report-list/report-product/report-product.component';
import { ReportParameterKoefComponent } from './components/cadaster-report-list/report-parameter-koef/report-parameter-koef.component';

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
        resolve: { dicUnit: DicUnitResolverService },
      },
      {
        path: 'parameter-gas',
        component: ReportParameterGasComponent,
        resolve: { dicUnit: DicUnitResolverService },
      },
      {
        path: 'report-product',
        component: ReportProductComponent,
      },
      {
        path: 'parameter-koef',
        component: ReportParameterKoefComponent,
        resolve: { dicUnit: DicUnitResolverService },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
