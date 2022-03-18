import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Dictionary } from '@models/dictionary.model';
import { DicOrganization } from '@models/dictionary/dic-org.model';
import { DicKindReportService } from '@services/dictionary/dic-kind-report.service';
import { DicOrganizationService } from '@services/dictionary/dic-org.service';
import { CadasterReportService } from 'src/app/services/cadaster-report.service';

@Component({
  selector: 'app-cadaster-report-form',
  templateUrl: './cadaster-report-form.component.html',
  styleUrls: ['./cadaster-report-form.component.css'],
})
export class CadasterReportFormComponent implements OnInit {
  form: FormGroup;
  submitted?: boolean;
  cdrReportPlants: any[] = [];
  dicKinds: Dictionary[] = [];
  dicOrganizations: DicOrganization[] = [];
  isActive = false;
  hideValidator = true;
  @Output() addCdrReport: EventEmitter<any> = new EventEmitter();
  @Output() updateCdrReport: EventEmitter<any> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private cdrReportService: CadasterReportService,
    private dicKindReportService: DicKindReportService,
    private dicOrganizationService: DicOrganizationService
  ) {
    this.form = this.fb.group({
      reportYear: new FormControl(2021, Validators.required),
      plantId: new FormControl('', Validators.required),
      kindId: new FormControl('', Validators.required),
      validatorId: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.cdrReportService
      .getCdrReportPlant(1, 2021)
      .subscribe((cdrReportPlants) => {
        this.cdrReportPlants = cdrReportPlants;
      });

    this.dicKindReportService
      .getDicKindReport()
      .subscribe((kind) => (this.dicKinds = kind));

    this.dicOrganizationService
      .getDicOrganizations('validator')
      .subscribe((organizations) => (this.dicOrganizations = organizations));
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = { ...this.form.value };
    !this.isActive
      ? this.addCdrReport.emit(data)
      : this.updateCdrReport.emit(data);
  }

  kindChange(value: number) {
    if (value === 2) {
      this.hideValidator = false;
    } else {
      this.hideValidator = true;
      this.form.controls['validatorId'].setValidators(Validators.required);
    }
  }

  yearChange(event: any) {
    const year = event.target.value;
    this.cdrReportService
      .getCdrReportPlant(1, year)
      .subscribe((cdrReportPlants) => {
        console.log(cdrReportPlants);
        this.cdrReportPlants = cdrReportPlants;
      });
  }

  editForm(id: number) {
    this.isActive = true;
    this.cdrReportService.getCadasterReportById(id).subscribe((data: any) => {
      console.log(data);
      this.form.patchValue(data);
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
