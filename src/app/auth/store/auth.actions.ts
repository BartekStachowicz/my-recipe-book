import { Action } from '@ngrx/store';

export const LOGIN_SUCCESS = '[AUTH] LOGIN_SUCCESS';
export const LOGOUT = '[AUTH] LOGOUT';
export const LOGIN_START = '[AUTH] LOGIN_START';
export const LOGIN_FAIL = '[AUTH] LOGIN_FAIL';
export const SIGNUP_START = '[AUTH] SIGNUP_START';
// export const SIGNUP_SUCCESS = '[AUTH] SIGNUP_SUCCESS';
export const RESET_ERROR = '[AUTH] ERROR_RESET';
export const AUTO_LOGIN = '[AUTH] AUTO_LOGIN';

export class LoginSuccess implements Action {
  readonly type = LOGIN_SUCCESS;
  constructor(
    public payload: {
      email: string;
      id: string;
      token: string;
      expirationDate: Date;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL;
  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = SIGNUP_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class ResetError implements Action {
  readonly type = RESET_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
}

export type AuthActions =
  | LoginSuccess
  | Logout
  | LoginStart
  | LoginFail
  | SignupStart
  | ResetError
  | AutoLogin;
