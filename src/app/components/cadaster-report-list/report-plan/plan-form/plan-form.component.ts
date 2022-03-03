import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { CadasterReportService } from '@services/cadaster-report.service'
import { ReportPlanService } from '@services/report-plan.service'
import { DicActivityService } from 'src/app/services/dic-activity.service'
import { ReportActivityChangeService } from 'src/app/services/report-activity-change.service'
@Component({
  selector: 'app-plan-form',
  templateUrl: './plan-form.component.html',
  styleUrls: ['./plan-form.component.css'],
})
export class PlanFormComponent implements OnInit {
  isActive = false
  form: FormGroup
  submitted?: boolean
  plantProcesses: any[] = []
  viewMode = false
  cdrReportId!: number
  @Output() onPlanAdded: EventEmitter<any> = new EventEmitter()
  @Output() onPlanUpdated: EventEmitter<any> = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private planService: ReportPlanService,
    private cadasterService: CadasterReportService,
  ) {
    this.form = this.fb.group({
      plantProcessId: new FormControl('', Validators.required),
      periodicity: new FormControl('', Validators.required),
      deviations: new FormControl('', Validators.required),
      reasons: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.cadasterService.currentReportData.subscribe((result: any) => {
      this.cdrReportId = result.id

      this.planService
        .getReportPlanProcessesByReportId(this.cdrReportId)
        .subscribe((result) => {
          this.plantProcesses = result
        })
    })
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }

    const data = { ...this.form.value }
    !this.isActive ? this.onPlanAdded.emit(data) : this.onPlanUpdated.emit(data)

    this.hidePlanDialog()
  }

  hidePlanDialog() {
    this.submitted = this.isActive = false
    this.form.reset()
  }

  editForm(id: number) {
    this.isActive = true
    this.planService.getReportPlanById(id).subscribe((data: any) => {
      console.log(data)
      this.form.patchValue(data)
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls
  }
}
