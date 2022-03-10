import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { DicActivityService } from 'src/app/services/dic-activity.service'
import { ReportActivityChangeService } from 'src/app/services/report-activity-change.service'

@Component({
  selector: 'app-activity-change-form',
  templateUrl: './activity-change-form.component.html',
  styleUrls: ['./activity-change-form.component.css'],
})

export class ActivityChangeFormComponent implements OnInit {
  isActive = false
  form: FormGroup
  submitted?: boolean
  dicRootActivityList: any[] = []
  viewMode = false
  @Output() onActivityChangeAdded: EventEmitter<any> = new EventEmitter()
  @Output() onActivityChangeUpdated: EventEmitter<any> = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private activityChangeService: ReportActivityChangeService,
    private dicActivity: DicActivityService,
  ) {
    this.form = this.fb.group({
      rootActivityId: new FormControl('', Validators.required),
      changeData: new FormControl('', Validators.required),
      note: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.dicActivity
      .getDicActivity()
      .subscribe((res) => (this.dicRootActivityList = res))
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }
    const data = { ...this.form.value }
    !this.isActive
      ? this.onActivityChangeAdded.emit(data)
      : this.onActivityChangeUpdated.emit(data)
  }

  editForm(id: number) {
    this.isActive = true
    this.activityChangeService
      .getReportActivityChangeById(id)
      .subscribe((data: any) => this.form.patchValue(data))
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls
  }
}
