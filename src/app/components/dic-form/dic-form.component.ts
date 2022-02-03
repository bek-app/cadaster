import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
 import { Dictionary } from 'src/app/models/dictionary.model';
@Component({
  selector: 'app-dic-form',
  templateUrl: './dic-form.component.html',
  styleUrls: ['./dic-form.component.css'],
})
export class DicFormComponent implements OnInit {
  showModal = false;
  submitted = false;
  form: FormGroup;

  @Input() dicTitle!: string;
  @Input() dicLabel!: string;
  @Output() dicAdded = new EventEmitter<Dictionary>();

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zа-яё\s]+$/iu),
      ]),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const data = {
      id: 0,
      ...this.form.value,
    };
    this.dicAdded.emit(data);
    this.hideDicFormModal();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  checkValue(event: any) {
    return String.fromCharCode(event.charCode).match(/^[a-zа-яё\s]+$/iu)
      ? event.CharCode
      : event.preventDefault();
  }

  hideDicFormModal() {
     this.form.reset();
    this.submitted = false;
  }
}
