import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStorageService } from '../services/data-storage.service';
import { AuthResponeData, AuthService } from './services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  authForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dataStorageService: DataStorageService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  onHandleError() {
    this.error = null;
  }

  onSubmit() {
    if (!this.authForm.valid) {
      return;
    }
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    let authObservable: Observable<AuthResponeData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObservable = this.authService.login(email, password);
    } else {
      authObservable = this.authService.signup(email, password);
    }

    authObservable.subscribe(
      (responseData) => {
        // console.log(responseData);
        this.isLoading = false;
        this.dataStorageService.fetchData().subscribe();
        this.router.navigate(['/recipes']);
      },
      (errorMsg) => {
        this.error = errorMsg;
        this.isLoading = false;
      }
    );

    this.authForm.reset();
  }

  onSwitchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  private initForm() {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }
}
