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
  plantList: any[] = []
  @Output() addCdrReport: EventEmitter<any> = new EventEmitter()
  constructor(private fb: FormBuilder, private plantService: PlantService) {
    this.form = this.fb.group({
      reportYear: new FormControl(2022, Validators.required),
      plantId: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.plantService.getPlantList(1).subscribe((plantList) => {
      console.log(plantList)
      this.plantList = plantList
    })
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }

    const data = { userId: 1, ...this.form.value }
    this.addCdrReport.emit(data)
    this.hideCdrReportFormDialog()
  }

  plantChange(event: any) {}

  hideCdrReportFormDialog() {
    this.submitted = false
    this.form.reset()
  }

  // editForm(id: number) {
  //   this.isActive = true
  //   this.cadasterReportService
  //     .getCadasterReportById(id)
  //     .subscribe((cdrReport) => {
  //       this.form.patchValue(cdrReport)
  //     })
  // }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls
  }
}
