import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { CadasterReportService } from 'src/app/services/cadaster-report.service'
import { PlantService } from 'src/app/services/plant.service'

@Component({
  selector: 'app-cadaster-report-form',
  templateUrl: './cadaster-report-form.component.html',
  styleUrls: ['./cadaster-report-form.component.css'],
})
export class CadasterReportFormComponent implements OnInit {
  form: FormGroup
  submitted?: boolean
  cdrReportPlants: any[] = []
  @Output() addCdrReport: EventEmitter<any> = new EventEmitter()
  constructor(
    private fb: FormBuilder,
    private cdrReportService: CadasterReportService,
  ) {
    this.form = this.fb.group({
      reportYear: new FormControl(2021, Validators.required),
      plantId: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.cdrReportService
      .getCdrReportPlant(1, 2021)
      .subscribe((cdrReportPlants) => {
        this.cdrReportPlants = cdrReportPlants
      })
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }

    const data = {  id: 0, ...this.form.value }
    this.addCdrReport.emit(data)
    this.hideCdrReportFormDialog()
  }

  yearChange(event: any) {
    const year = event.target.value
    this.cdrReportService
      .getCdrReportPlant(1, year)
      .subscribe((cdrReportPlants) => {
        console.log(cdrReportPlants)
        this.cdrReportPlants = cdrReportPlants
      })
  }
  plantChange(event: any) {}

  hideCdrReportFormDialog() {
    this.submitted = false
    this.form.reset()
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls
  }
}
