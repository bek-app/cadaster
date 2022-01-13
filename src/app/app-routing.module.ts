import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantDeviceListComponent } from './components/plant-list/plant-device-list/plant-device-list.component';
import { PlantListComponent } from './components/plant-list/plant-list.component';
import { PlantProcessListComponent } from './components/plant-list/plant-process-list/plant-process-list.component';
import { PlantSamplingListComponent } from './components/plant-list/plant-sampling-list/plant-sampling-list.component';
import { PlantSourceListComponent } from './components/plant-list/plant-source-list/plant-source-list.component';
import { CadasterReportListComponent } from './components/cadaster-report-list/cadaster-report-list.component';
import { ProductsComponent } from './components/plant-list/products/products.component';
import { ActualEmissionComponent } from './components/cadaster-report-list/actual-emission/actual-emission.component';
import { CadasterReportComponent } from './components/cadaster-report/cadaster-report.component';
import { ParameterCalcComponent } from './components/cadaster-report-list/parameter-calc/parameter-calc.component';
import { DicUnitResolverService } from './services/dic-unit-resolver.service';

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
        path: 'products',
        component: ProductsComponent,
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
      { path: 'actual-emission', component: ActualEmissionComponent },
      {
        path: 'parameter-calc',
        component: ParameterCalcComponent,
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
