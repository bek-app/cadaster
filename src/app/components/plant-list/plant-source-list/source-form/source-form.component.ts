import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PlantSourceService } from 'src/app/services/plant-source.service';
@Component({
  selector: 'app-source-form',
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.css'],


})
export class SourceFormComponent implements OnInit {
  form: FormGroup;
  isActive = false;
  submitted?: boolean;
  @Output() onPlantSourceAdded: EventEmitter<any> = new EventEmitter();
  @Output() onPlantSourceUpdated: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private plantSourceService: PlantSourceService,

  ) {
    this.form = this.fb.group({
      nameSource: new FormControl('', Validators.required),
      characteristic: new FormControl('', Validators.required),
      installedCapacity: new FormControl(),
      workinHours: new FormControl('', Validators.required),
    });

  }

  ngOnInit(): void { }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  editForm(id: any) {
    this.isActive = true;
    this.plantSourceService.getPlantSourceById(id).subscribe((data) => {
      this.form.patchValue(data);
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = { ...this.form.value };
    !this.isActive
      ? this.onPlantSourceAdded.emit(data)
      : this.onPlantSourceUpdated.emit(data);
    this.hideSourceModal();
  }

  hideSourceModal() {
    this.isActive = false;
    this.form.reset();
    this.submitted = false;

  }
}
