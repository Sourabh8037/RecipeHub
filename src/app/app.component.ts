import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth/store/auth.actions';
import * as fromApp from './store/app.reducer';
import '../styles.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private store:Store<fromApp.IAppState>){}
  ngOnInit(){
    this.store.dispatch(new AuthActions.AutoLogin());
  }

}
