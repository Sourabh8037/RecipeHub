import { User } from '../user.model';
import * as AuthActions from './auth.actions';

export interface IAuthState{
  user:User;
  authError:{title:string,body:string};
  loading:boolean;
  redirect:boolean;
}

const initialState:IAuthState = {
  user:null,
  authError:null,
  loading:false,
  redirect:true,
}

const authenticateSuccess = (state:IAuthState,action) =>({...state,user:action.payload.loadedUser,authError:null,loading:false});

const authenticateStart = (state,action) =>({...state,authError:null,loading:true});

const authenticateFail = (state,action) =>({...state,authError:action.payload,user:null,loading:false});

const logout = (state,action) =>({...state,user:null,authError:null});

const clearError = (state,action) => ({...state,authError:null});

export const  authReducer = (state:IAuthState=initialState,action:AuthActions.AuthActions) =>{
  switch(action.type){
    case AuthActions.AUTHENTICATE_SUCCESS:return authenticateSuccess(state,action);
    case AuthActions.LOGOUT:return logout(state,action);
    case AuthActions.SIGNUP_START:
    case AuthActions.LOGIN_START: return authenticateStart(state,action);
    case AuthActions.AUTHENTICATE_FAIL: return authenticateFail(state,action);
    case AuthActions.CLEAR_ERROR : return clearError(state,action);
    default: return state;
  }
}