import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { DicKatoService } from 'src/app/services/dic-kato.service'
import { PlantService } from 'src/app/services/plant.service'

@Component({
  selector: 'app-plant-form',
  templateUrl: './plant-form.component.html',
  styleUrls: ['./plant-form.component.css'],
})
export class PlantFormComponent implements OnInit {
  isActive = false
  form: FormGroup
  submitted?: boolean

  oblast: any[] = []
  region: any[] = []
  subRegion: any[] = []
  village: any[] = []

  oblastName!: string
  regionName!: string
  subRegionName!: string
  villageName!: string
  address: string = ''
  viewMode = false
  @Output() addPlant: EventEmitter<any> = new EventEmitter()
  @Output() updatePlant: EventEmitter<any> = new EventEmitter()

  constructor(
    private plantService: PlantService,
    private fb: FormBuilder,
    private dicKatoService: DicKatoService,
  ) {
    this.form = this.fb.group({
      namePlant: new FormControl('', Validators.required),
      oblastId: new FormControl('', Validators.required),
      regionId: new FormControl('', Validators.required),
      subRegionId: new FormControl(),
      villageId: new FormControl(),
      address: new FormControl(),
      inactive: new FormControl(true, Validators.required),
    })
  }

  ngOnInit(): void {
    this.dicKatoService.getDicKato(1).subscribe((oblast) => {
      this.oblast = oblast
    })
  }

  oblastChange(oblastId: number) {
    if (oblastId) {
      this.oblastName = this.oblast.find(
        (obl) => obl.id === this.form.value.oblastId,
      )?.name

      if (this.oblastName) {
        this.form.controls.address.setValue(this.oblastName)
        this.form.controls.regionId.setValue(null)
        this.subRegion = []
        this.village = []
      }
      this.dicKatoService.getDicKato(oblastId).subscribe((region) => {
        this.region = region
      })
    }
  }

  regionChange(regionId: number) {
    if (regionId) {
      this.oblastName = this.oblast.find(
        (obl) => obl.id === this.form.value.oblastId,
      )?.name

      this.regionName = this.region.find((reg) => reg.id === regionId)?.name

      if (this.oblastName && this.regionName) {
        this.address = `${this.oblastName}, ${this.regionName}`
        this.form.controls.address.setValue(this.address)
        this.form.value.villageId = null
        this.form.value.subRegionId = null
        this.village = []
      }

      this.dicKatoService.getDicKato(regionId).subscribe((subRegion) => {
        this.subRegion = subRegion
      })
    }
  }

  subRegionChange(subRegionId: number) {
    if (subRegionId) {
      this.subRegionName = this.subRegion.find(
        (subReg) => subReg.id === subRegionId,
      )?.name

      if (!this.oblastName)
        this.oblastName = this.oblast.find(
          (obl) => obl.id === this.form.value.oblastId,
        )?.name

      if (!this.regionName)
        this.regionName = this.region.find(
          (reg) => reg.id === this.form.value.regionId,
        )?.name

      if (this.oblastName && this.regionName && this.subRegionName) {
        this.address = `${this.oblastName}, ${this.regionName}, ${this.subRegionName} `
        this.form.controls.address.setValue(this.address)
      }
      this.dicKatoService.getDicKato(subRegionId).subscribe((village) => {
        this.village = village
      })
    }
  }

  villageChange(villageId: number) {
    if (villageId) {
      this.villageName = this.village.find(
        (vill) => vill.id === villageId,
      )?.name

      if (!this.oblastName)
        this.oblastName = this.oblast.find(
          (obl) => obl.id === this.form.value.oblastId,
        )?.name

      if (!this.regionName)
        this.regionName = this.region.find(
          (reg) => reg.id === this.form.value.regionId,
        )?.name

      if (!this.subRegionName)
        this.subRegionName = this.subRegion.find(
          (subReg) => subReg.id === this.form.value.subRegionId,
        )?.name

      if (
        this.oblastName &&
        this.regionName &&
        this.subRegionName &&
        this.villageName
      ) {
        this.address = `${this.oblastName}, ${this.regionName}, ${this.subRegionName}, ${this.villageName}`
        this.form.controls.address.setValue(this.address)
      }
    }
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }

    const data = { userId: 1, ...this.form.value }
    !this.isActive ? this.addPlant.emit(data) : this.updatePlant.emit(data)
    this.hidePlantModal()
  }
  hidePlantModal() {
    this.submitted = this.isActive = false
    this.form.reset()
  }

  editForm(id: number) {
    this.isActive = true
    this.plantService
      .getPlantById(id)
      .subscribe((data: any) => this.form.patchValue(data))
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls
  }
}
