import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Dictionary } from 'src/app/models/dictionary.model'
import { CadasterReportService } from 'src/app/services/cadaster-report.service'
import { DicReportStatusService } from 'src/app/services/dic-report-status.service'

@Component({
  selector: 'app-cdr-report-check-list',
  templateUrl: './cdr-report-check-list.component.html',
  styleUrls: ['./cdr-report-check-list.component.css'],
})
export class CdrReportCheckListsComponent implements OnInit {
  reportCadasterId!: number
  cdrReportRoute: any
  cdrReportItem: any
  dicReportStatusList: Dictionary[] = []
  form: FormGroup
  submitted = false
  cdrReportId!: number
  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private cadasterService: CadasterReportService,
    private router: Router,
    private fb: FormBuilder,
    private dicReportStatusService: DicReportStatusService,
  ) {
    this.form = this.fb.group({
      statusId: new FormControl('', Validators.required),
      design: new FormControl('', Validators.required),
    })
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
      (param: Params) => (this.cdrReportId = +param['id']),
    )
    this.dicReportStatusService
      .getDicReportStatus()
      .subscribe((status) => (this.dicReportStatusList = status))

    this.cadasterService
      .getCadasterReportById(this.cdrReportId)
      .subscribe((result) => (this.cdrReportItem = result))

    this.translate.get('CDR_REPORTS.MENU').subscribe((translations: any) => {
      const {
        ACTUAL_EMISSION,
        PARAMETER_CALC,
        PARAMETER_GAS,
        PRODUCT,
        PARAMETER_KOEF,
        ACTIVITY,
        ACTIVITY_CHANGE,
        CARBON_UNIT,
        PLAN,
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

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }
    const data = {
      id: this.reportCadasterId,
      ...this.form.value,
    }

    this.cadasterService.changeReportStatus(data).subscribe((result: any) => {
      this.router.navigate(['common/cadaster-report-check'])
    })
  }
}
