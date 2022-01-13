import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Dictionary } from 'src/app/models/dictionary.model';
import { DicUnitService } from 'src/app/services/dic-unit.service';
import { DicFormComponent } from '../dic-form/dic-form.component';

@Component({
  selector: 'app-editor-ng-select',
  templateUrl: './editor-ng-select.component.html',
  styleUrls: ['./editor-ng-select.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class EditorNgSelectComponent implements OnInit {
  selectedId: any;
  selectedItem: any;
  collection!: any[]; // this will be filled by the collection of your column definition
  onItemChanged = new Subject<any>(); // object
  ref: any;
  dicUnit!: string;

  constructor(
    private modalService: NgbModal,
    private dicUnitService: DicUnitService
  ) {}
  ngOnInit(): void {}
  onChange(item: any) {
    this.selectedItem = item;
    this.onItemChanged.next(item);
  }
  openModal(name: string) {
    this.ref = this.modalService.open(DicFormComponent, {
      size: 'md',
    });
    if (name === 'dicUnit') {
      this.ref.componentInstance.dicTitle = 'Добавить eдиница измерения';
       this.ref.componentInstance.dicLabel = 'Единица измерения ';
      this.dicUnitAdded();
    }
  }
  dicUnitAdded() {
    this.ref.componentInstance.dicAdded.subscribe((data: Dictionary) => {
      this.dicUnitService.addDicUnit(data).subscribe((res) => {
        this.collection.push(res);
        this.onChange(res);
      });
    });
  }
  focus() {}
}
