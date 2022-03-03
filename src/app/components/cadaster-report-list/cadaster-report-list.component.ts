import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { filter } from 'rxjs'
import { CadasterReportService } from 'src/app/services/cadaster-report.service'
@Component({
  selector: 'app-cadaster-report-list',
  templateUrl: './cadaster-report-list.component.html',
  styleUrls: ['./cadaster-report-list.component.css'],
})
export class CadasterReportListComponent implements OnInit {
  reportCadasterId!: number
  cdrReportRoute: any
  cdrReportItem: any
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private cadasterService: CadasterReportService,
    private router: Router,
  ) {
    this.translate.get('CDR_REPORTS.MENU').subscribe((translations: any) => {
      const {
        ACTUAL_EMISSION,
        PARAMETER_CALC,
        PARAMETER_GAS,
        PRODUCT,
        PARAMETER_KOEF,
        ACTIVITY,
        ACTIVITY_CHANGE,
        CARBON_UNIT,PLAN
      } = translations
      this.cdrReportRoute = [
        {
          src: 'actual-emission',
          name: ACTUAL_EMISSION,
        },
        {
          src: 'parameter-koef',
          name: PARAMETER_KOEF,
        },
        {
          src: 'parameter-calc',
          name: PARAMETER_CALC,
        },

        {
          src: 'parameter-gas',
          name: PARAMETER_GAS,
        },
        {
          src: 'report-product',
          name: PRODUCT,
        },
        {
          src: 'report-activity',
          name: ACTIVITY,
        },
        {
          src: 'report-activity-change',
          name: ACTIVITY_CHANGE,
        },
        {
          src: 'report-carbon-unit',
          name: CARBON_UNIT,
        },
        {
          src: 'report-plan',
          name: PLAN,
        },
      ]
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (param: Params) => (this.reportCadasterId = +param['id']),
    )

    this.cadasterService.currentReportData.subscribe((result: any) => {
      this.cdrReportItem = result
    })
  }

  onActivate(componentReference: any) {
    if (this.reportCadasterId !== undefined) {
      componentReference.goToCadasterReports(this.reportCadasterId)
    }
  }
}
