import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  
  registrationForm: FormGroup;
  loading: boolean = false;

  constructor(private router: Router) { 

    this.registrationForm = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required)
  });
  }

  ngOnInit(): void {
  }

  register() {

  }

  toLogin() {
    this.router.navigate(['/full/login']);
  }
}
