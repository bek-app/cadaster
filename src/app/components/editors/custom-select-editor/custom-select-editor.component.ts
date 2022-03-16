import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { faCommentDots } from '@fortawesome/free-solid-svg-icons'
import { MtxSelectComponent } from '@ng-matero/extensions/select'
import { AuthenticationService } from '@services/auth/authentication.service'
import { Subject } from 'rxjs'
import { Dictionary } from 'src/app/models/dictionary.model'
import { DicUnitService } from 'src/app/services/dic-unit.service'
import { ReportCommentEditorComponent } from '../../cadaster-report-list/report-comment-editor/report-comment-editor.component'
import { DicFormComponent } from '../../dic-form/dic-form.component'

@Component({
  selector: 'app-custom-select-editor',
  templateUrl: './custom-select-editor.component.html',
  styleUrls: ['./custom-select-editor.component.css'],
})
export class CustomSelectEditorComponent implements OnInit, AfterViewInit {
  selectedId: any
  selectedItem: any
  collection!: any[] // this will be filled by the collection of your column definition
  onItemChanged = new Subject<any>() // object
  ref: any
  dicUnit!: string
  clearStatus: boolean = false
  dialogRef: any
  faCommentDots = faCommentDots
  role: boolean = false
  form: FormGroup
  @ViewChild(MtxSelectComponent) select!: MtxSelectComponent

  constructor(
    private dicUnitService: DicUnitService,
    public dialog: MatDialog,
    private authService: AuthenticationService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      selectItem: new FormControl(''),
    })
  }

  ngAfterViewInit(): void {
    // const userInfo = this.authService.getUserData()
    // const role = userInfo?.roles?.[0]
    // if (role === 'adminisrat0or') {
    //   this.role = true
    //   this.form.controls['selectItem'].disable()
    // }
  }

  ngOnInit(): void {
    if (this.selectedId) {
      this.clearStatus = !this.clearStatus
    }
  }

  onChange(item: any) {
    if (item !== undefined) {
      this.selectedItem = item
      this.onItemChanged.next(item)
    }
  }

  openCommentDialog() {
    this.dialogRef = this.dialog.open(ReportCommentEditorComponent, {
      minWidth: '400px',
      width: '500px',
    })

    this.dialogRef.componentInstance.saveComment.subscribe((result: any) => {
      console.log(result)
    })
  }

  clearValue() {
    this.onChange({ id: null, name: '' })
  }

  openDicDialog(name: string) {
    this.select.close()
    this.ref = this.dialog.open(DicFormComponent, {
      width: '600px',
    })
    if (name === 'dicUnit') {
      this.ref.componentInstance.dicTitle = 'Добавить eдиница измерения'
      this.ref.componentInstance.dicLabel = 'Единица измерения '
      this.dicUnitAdded()
    }
  }

  dicUnitAdded() {
    this.ref.componentInstance.dicAdded.subscribe((data: Dictionary) => {
      this.dicUnitService.addDicUnit(data).subscribe((res) => {
        this.collection.push(res)
        this.onChange(res)
        this.ref.close()
      })
    })
  }

  focus() {}
}
