import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CadasterReportService } from 'src/app/services/cadaster-report.service';

@Component({
  selector: 'app-cdr-report-check-list',
  templateUrl: './cdr-report-check-list.component.html',
  styleUrls: ['./cdr-report-check-list.component.css']
})
export class CdrReportCheckListsComponent implements OnInit {

  reportCadasterId!: number
  cdrReportRoute: any
  cdrReportItem: any
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private cadasterService: CadasterReportService,
   ) {
    this.translate.get('CDR_REPORTS.MENU').subscribe((translations: any) => {
      const {
        ACTUAL_EMISSION,
        PARAMETER_CALC,
        PARAMETER_GAS,
        PRODUCT,
        PARAMETER_KOEF,
      } = translations
      this.cdrReportRoute = [
        {
          src: 'actual-emission',
          name: ACTUAL_EMISSION,
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
          src: 'parameter-koef',
          name: PARAMETER_KOEF,
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
