import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { DicActivityService } from '@services/dictionary/dic-activity.service'
import { DicUnitService } from 'src/app/services/dic-unit.service'
import { PlantActivityService } from 'src/app/services/plant-activity.service'

@Component({
  selector: 'app-activity-form',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.css'],
})
export class ActivityFormComponent implements OnInit {
  isActive = false
  form: FormGroup
  submitted?: boolean
  viewMode = false
  dicRootActivityList: any[] = []
  dicActivityList: any[] = []
  dicUnitList: any[] = []
  @Output() onActivityAdded: EventEmitter<any> = new EventEmitter()
  @Output() onActivityUpdated: EventEmitter<any> = new EventEmitter()

  constructor(
    private dicActivity: DicActivityService,
    private fb: FormBuilder,
    private activityService: PlantActivityService,
    private dicUnitService: DicUnitService,
  ) {
    this.form = this.fb.group({
      rootActivityId: new FormControl('', Validators.required),
      activityId: new FormControl('', Validators.required),
      dicUnitId: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.dicActivity
      .getDicActivity()
      .subscribe((res) => (this.dicRootActivityList = res))
    this.dicUnitService
      .getDicUnit()
      .subscribe((res) => (this.dicUnitList = res))
  }

  rootActivityChange(rootActivityId: number) {
    if (rootActivityId) {
      this.dicActivity
        .getDicActivityByParentId(rootActivityId)
        .subscribe((result) => (this.dicActivityList = result))
    }
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }
    const data = { ...this.form.value }
    !this.isActive
      ? this.onActivityAdded.emit(data)
      : this.onActivityUpdated.emit(data)
  }

  editForm(id: number) {
    this.isActive = true
    this.activityService
      .getPlantActivityById(id)
      .subscribe((data: any) => this.form.patchValue(data))
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls
  }
}
