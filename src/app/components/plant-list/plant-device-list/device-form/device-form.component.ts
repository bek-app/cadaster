import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { PlantDeviceService } from 'src/app/services/plant-device.service'

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.css'],
})
export class DeviceFormComponent implements OnInit {
  form: FormGroup
  isActive = false
  submitted = false
  viewMode = false
  @Output() addDevice: EventEmitter<any> = new EventEmitter()
  @Output() updateDevice: EventEmitter<any> = new EventEmitter()

  constructor(
    private fb: FormBuilder,
    private plantDeviceService: PlantDeviceService,
  ) {
    this.form = this.fb.group({
      nameDevice: new FormControl('', Validators.required),
      identificationNumber: new FormControl('', Validators.required),
      unitDevice: new FormControl('', Validators.required),
      lowerLimit: new FormControl('', Validators.required),
      upperLimit: new FormControl(),
      specifiedUncertainty: new FormControl(),
    })
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }
    const data = { ...this.form.value }
    !this.isActive ? this.addDevice.emit(data) : this.updateDevice.emit(data)
  }

  editForm(id: number) {
    this.isActive = true
    this.plantDeviceService.getPlantDeviceById(id).subscribe((data) => {
      this.form.patchValue(data)
    })
  }
}
