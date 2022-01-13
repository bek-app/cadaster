import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cadaster-report-form',
  templateUrl: './cadaster-report-form.component.html',
  styleUrls: ['./cadaster-report-form.component.css'],
})
export class CadasterReportFormComponent implements OnInit {
  isActive = false;
  form: FormGroup;
  submitted?: boolean;

  @Output() addPlant: EventEmitter<any> = new EventEmitter();
  @Output() updatePlant: EventEmitter<any> = new EventEmitter();
  constructor(private activeModal: NgbActiveModal, private fb: FormBuilder) {
    this.form = this.fb.group({
      namePlant: new FormControl('', Validators.required),
      oblastId: new FormControl('', Validators.required),
      regionId: new FormControl('', Validators.required),
      subRegionId: new FormControl(),
      villageId: new FormControl(),
      address: new FormControl(),
      inactive: new FormControl(true, Validators.required),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = { userId: 1, ...this.form.value };
    !this.isActive ? this.addPlant.emit(data) : this.updatePlant.emit(data);
    this.hideCadasterModal();
  }
  hideCadasterModal() {
    this.activeModal.close();
    this.submitted = this.isActive = false;
    this.form.reset();
  }

  editForm(id: number) {
    this.isActive = true;
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
