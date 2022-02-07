import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CadasterReportService } from 'src/app/services/cadaster-report.service';

@Component({
  selector: 'app-cadaster-report-form',
  templateUrl: './cadaster-report-form.component.html',
  styleUrls: ['./cadaster-report-form.component.css'],
})
export class CadasterReportFormComponent implements OnInit {
  isActive = false;
  form: FormGroup;
  submitted?: boolean;
  plantList: any[] = []
  @Output() addPlant: EventEmitter<any> = new EventEmitter();
  @Output() updatePlant: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private cadasterReportService: CadasterReportService
  ) {
    this.form = this.fb.group({
      namePlant: new FormControl('', Validators.required),
      reportYear: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const data = { userId: 1, ...this.form.value };
    !this.isActive ? this.addPlant.emit(data) : this.updatePlant.emit(data);
    this.hideCdrReportFormDialog();
  }
  plantChange(event: any) {

  }
  hideCdrReportFormDialog() {
    this.submitted = false;
    this.isActive = false;
    this.form.reset();
  }

  editForm(id: number) {
    this.isActive = true;
    this.cadasterReportService
      .getCadasterReportById(id)
      .subscribe((cdrReport) => this.form.patchValue(cdrReport));
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
