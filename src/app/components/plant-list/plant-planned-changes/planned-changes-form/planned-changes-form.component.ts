import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { PlannedChangesModel } from 'src/app/models/plant-planned-changes.model'
import { DicProcessService } from 'src/app/services/dic-process.service'
import { PlannedChangesService } from 'src/app/services/planned-changes.service'
import { PlantProcessService } from 'src/app/services/plant-process.service'
import { PlantSourceService } from 'src/app/services/plant-source.service'
@Component({
  selector: 'app-planned-changes-form',
  templateUrl: './planned-changes-form.component.html',
  styleUrls: ['./planned-changes-form.component.css'],
})
export class PlannedChangesFormComponent implements OnInit {
  form: FormGroup
  isActive = false
  submitted?: boolean
  sourceList: any[] = []
  processList: any[] = []
  viewMode = false
  @Output() onPlannedChangesAdded: EventEmitter<
    PlannedChangesModel
  > = new EventEmitter()

  @Output() onPlannedChangesUpdated: EventEmitter<
    PlannedChangesModel
  > = new EventEmitter()
  constructor(
    private fb: FormBuilder,
    private plannedChangesService: PlannedChangesService,
    private plantSourceService: PlantSourceService,
    private processService: PlantProcessService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      plantProcessId: new FormControl(''),
      plantSourceId: new FormControl(),
      plannedChange: new FormControl('', Validators.required),
      changeYear: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    const { plantId } = this.data
    this.plantSourceService.getPlantSourceList(plantId).subscribe((source) => {
      this.sourceList = source
    })
    this.processService.getPlantProcessList(plantId).subscribe((process) => {
      console.log(process)

      this.processList = process
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls
  }

  editForm(id: any) {
    this.isActive = true
    this.plannedChangesService.getPlannedChangesById(id).subscribe((data) => {
      this.form.patchValue(data)
    })
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }
    const data = { ...this.form.value }
    !this.isActive
      ? this.onPlannedChangesAdded.emit(data)
      : this.onPlannedChangesUpdated.emit(data)
    this.hidePlannedChangesModal()
  }

  hidePlannedChangesModal() {
    this.isActive = false
    this.form.reset()
    this.submitted = false
  }
}
