import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
 showSpinner = false;
  error: string = null!;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  onSwitchMode(method:number): void {
    switch(method){
      case 1:this.isLoginMode = false;break;
      case 2 :this.isLoginMode = true;break;
    }
    // this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm): void {  
    this.error = '';
    this.showSpinner = true;
    const email = form.value.email;
    const password = form.value.password;
    let authObservable!: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      authObservable = this.authService.signIn(email, password);
    } else if (!this.isLoginMode) { 
    authObservable = this.authService.signUp(email, password);
  }
    authObservable.subscribe({
      next: (data) => {
        setTimeout(() => {
          this.showSpinner=false;
          this.router.navigate(['/']);
        }, 1600);
        
        

      },
      error: (errorMessage) => {
        setTimeout(() => {
          this.showSpinner=false;
          this.error = errorMessage;
        }, 1600);

        
      },
      
    });
    form.reset();
  }
  onHandelErrorMessage() {
    this.error = null!;
  }
}
function data(data: any) {
  throw new Error('Function not implemented.');
}

