import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { DicFormComponent } from 'src/app/components/dic-form/dic-form.component'
import { Dictionary } from 'src/app/models/dictionary.model'
import { PlantSamplingModel } from 'src/app/models/plant-sampling.model'
import { DicMaterialService } from 'src/app/services/dic-materials.service'
import { PlantSamplingService } from 'src/app/services/plant-sampling.service'
@Component({
  selector: 'app-sampling-form',
  templateUrl: './sampling-form.component.html',
  styleUrls: ['./sampling-form.component.css'],
})
export class SamplingFormComponent implements OnInit {
  form: FormGroup
  isActive = false
  submitted?: boolean
  dicMaterialsList: Dictionary[] = []
  ref: any
  viewMode = false
  @Output() onSamplingAdded: EventEmitter<
    PlantSamplingModel
  > = new EventEmitter()
  @Output() onSamplingUpdated: EventEmitter<
    PlantSamplingModel
  > = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private samplingService: PlantSamplingService,
    private dicMaterialService: DicMaterialService,
    private dialog: MatDialog,
  ) {
    this.form = this.fb.group({
      nameSampling: new FormControl('', Validators.required),
      materials: new FormControl('', Validators.required),
      param: new FormControl('', Validators.required),
      methodSampling: new FormControl('', Validators.required),
      frequencySampling: new FormControl('', Validators.required),
      periodTransmission: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.getDicMaterial()
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls
  }

  editForm(id: any) {
    this.isActive = true
    this.samplingService.getPlantSamplingById(id).subscribe((data) => {
      this.form.patchValue(data)
    })
  }

  openDicFormModal(name: string) {
    this.ref = this.dialog.open(DicFormComponent, {
      width: '600px',
    })
    if (name === 'dicMaterial') {
      this.ref.componentInstance.dicTitle = 'Добавить материалы'
      this.ref.componentInstance.dicLabel = 'Материал'
      this.dicMaterialAdded()
    }
  }

  dicMaterialAdded() {
    this.ref.componentInstance.dicAdded.subscribe((data: Dictionary) => {
      this.dicMaterialService.addDicMaterial(data).subscribe((res) => {
        this.getDicMaterial()
        this.form.controls.materials.setValue([res.id])
      })
    })
  }

  getDicMaterial() {
    this.dicMaterialService
      .getDicMaterial()
      .subscribe((res) => (this.dicMaterialsList = res))
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }

    const data = { ...this.form.value }
    !this.isActive
      ? this.onSamplingAdded.emit(data)
      : this.onSamplingUpdated.emit(data)
  }
}
