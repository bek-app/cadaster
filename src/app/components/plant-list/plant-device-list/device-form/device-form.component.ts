import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data } from 'jquery';
import { PlantDeviceService } from 'src/app/services/plant-device.service';
import { PlantService } from 'src/app/services/plant.service';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.css'],
})
export class DeviceFormComponent implements OnInit {
  form: FormGroup;
  isActive = false;
  submitted = false;
  @Output() addDevice: EventEmitter<any> = new EventEmitter();
  @Output() updateDevice: EventEmitter<any> = new EventEmitter();
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private plantDeviceService: PlantDeviceService,
    private activeModal: NgbActiveModal
  ) {
    this.form = this.fb.group({
      nameDevice: new FormControl('', Validators.required),
      identificationNumber: new FormControl('', Validators.required),
      unitDevice: new FormControl('', Validators.required),
      lowerLimit: new FormControl('', Validators.required),
      upperLimit: new FormControl(),
      specifiedUncertainty: new FormControl(),
    });
  }

  ngOnInit(): void {}
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = { ...this.form.value };

    !this.isActive ? this.addDevice.emit(data) : this.updateDevice.emit(data);

    this.hidePlantDeviceModal();
  }

  editForm(id: number) {
    this.isActive = true;
    this.plantDeviceService.getPlantDeviceById(id).subscribe((data) => {
      this.form.patchValue(data);
    });
  }
  hidePlantDeviceModal() {
    this.activeModal.close();
    this.form.reset();
    this.submitted = false;
    this.isActive = false;
  }
}
