import {
  Component,
  EventEmitter,
  OnInit,
  Output 
} from '@angular/core'
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
import { DicProductService } from 'src/app/services/dic-product.service'
import { DicUnitService } from 'src/app/services/dic-unit.service'
import { PlantProductService } from 'src/app/services/plant-product.service'

@Component({
  selector: 'app-plant-product-form',
  templateUrl: './plant-product-form.component.html',
  styleUrls: ['./plant-product-form.component.css'],
})
export class PlantProductFormComponent implements OnInit {
  form: FormGroup
  submitted?: boolean
  isActive = false
  dicProductList: Dictionary[] = []
  dicUnitList: Dictionary[] = []
  dicRef: any
  @Output() addProduct: EventEmitter<any> = new EventEmitter()
  @Output() updateProduct: EventEmitter<any> = new EventEmitter()
  constructor(
    private formBuilder: FormBuilder,
    private dicProductService: DicProductService,
    private dicUnitService: DicUnitService,
    private plantProductService: PlantProductService,
    private dicFormDialog: MatDialog,
  ) {
    this.form = this.formBuilder.group({
      dicProductId: new FormControl('', Validators.required),
      dicUnitId: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.getDicProduct()
    this.getDicUnit()
  }

  getDicProduct() {
    this.dicProductService
      .getDicProduct()
      .subscribe((dicProduct) => (this.dicProductList = dicProduct))
  }

  getDicUnit() {
    this.dicUnitService
      .getDicUnit()
      .subscribe((dicUnit) => (this.dicUnitList = dicUnit))
  }

  onSubmit() {
    this.submitted = true
    if (this.form.invalid) {
      return
    }
    const data = { ...this.form.value }
    !this.isActive ? this.addProduct.next(data) : this.updateProduct.next(data)
  }

  openDicModal(name: string, select: any) {
    select.close()
    this.dicRef = this.dicFormDialog.open(DicFormComponent, {
      width: '600px',
    })

    if (name === 'dicProduct') {
      this.dicRef.componentInstance.dicTitle = '???????????????? ????????????????'
      this.dicRef.componentInstance.dicLabel = '??????????????'
      this.onAddDicProduct()
    } else {
      this.dicRef.componentInstance.dicTitle = '???????????????? ???????????? ??????????????????'
      this.dicRef.componentInstance.dicLabel = '???????????? ??????????????????'
      this.onAddDicUnit()
    }
  }

  onAddDicProduct() {
    this.dicRef.componentInstance.dicAdded.subscribe(
      (dicProduct: Dictionary) => {
        this.dicProductService.addDicProduct(dicProduct).subscribe((result) => {
          this.getDicProduct()
          this.form.controls['dicProductId'].setValue(result.id)
          this.dicRef.close()
        })
      },
    )
  }

  onAddDicUnit() {
    this.dicRef.componentInstance.dicAdded.subscribe((dicUnit: Dictionary) => {
      this.dicUnitService.addDicUnit(dicUnit).subscribe((result) => {
        this.getDicUnit()
        this.form.controls['dicUnitId'].setValue(result.id)
        this.dicRef.close()
      })
    })
  }

  editForm(id: number) {
    this.isActive = true
    this.plantProductService.getPlantProductById(id).subscribe((product) => {
      this.form.patchValue(product)
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls
  }
}
