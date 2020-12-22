import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';
import '../../styles.css';

@Component({
  selector:"app-auth",
  templateUrl:'./auth.component.html'
})

export class AuthComponent implements OnInit,OnDestroy{
  isLogin:boolean = true;
  isLoading:boolean = false;
  error:{title:string,body:string} = null;
  subscription:Subscription;

  constructor(
    private router:Router,
    private store:Store<fromApp.IAppState>
    ){}

    ngOnInit(){
    this.subscription = this.store.select('auth').subscribe(authState=>{
        this.isLoading = authState.loading;
        this.error = authState.authError;
      })
    }
  
  onSwitchMode = () => this.isLogin = !this.isLogin;
  // onClearError = () => this.error = null;
  
  onSubmit(form:NgForm){
    if(!form.valid){
      return;
    }
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    //DISPATCHING LOGIN OR SIGNUP
    if(this.isLogin){
      this.store.dispatch(new AuthActions.LoginStart({email,password}));
    }else{
      this.store.dispatch(new AuthActions.SignupStart({email,password}));
    }
  }
  onHandleError(){
    this.store.dispatch(new AuthActions.ClearError());
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}