import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  // @Input() usersFromHomeComp: any;
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validationErrors: string[] | undefined;

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  matchValues(macthTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(macthTo)?.value
        ? null
        : { notMacthing: true };
    };
  }

  register() {    
    this.accountService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/members')
      },
      error: error => {
        this.validationErrors = error;
      }
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  // private getDate(dob: string | undefined)
  // {
  //   if(!dob) return;
  //   let theDob = new Date(dob);
  //   return new Date().toISOString();
  // }
}
