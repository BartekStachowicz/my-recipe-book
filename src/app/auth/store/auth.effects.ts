import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, switchMap, map, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const authentication = (
  email: string,
  id: string,
  token: string,
  expiresIn: number
) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, id, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.LoginSuccess({
    email: email,
    id: id,
    token: token,
    expirationDate: expirationDate,
  });
};

const handleError = (error: any) => {
  let errorMsg = 'An unknow error occured!';
  if (!error.error || !error.error.error) {
    return of(new AuthActions.LoginFail(errorMsg));
  }
  switch (error.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMsg = 'Email already exists!';
      break;
    case 'EMAIL_NOT_FOUND':
    case 'INVALID_PASSWORD':
      errorMsg = 'Email or password are invalid!';
      break;
    case 'USER_DISABLED':
      errorMsg = 'The user account has been disabled by an administrator.';
      break;
  }
  return of(new AuthActions.LoginFail(errorMsg));
};

@Injectable()
export class AuthEffects {
  authLoginURL: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIkey}`;
  authSignUpURL: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIkey}`;

  authLogin = createEffect((): Observable<any> => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(this.authLoginURL, {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          })
          .pipe(
            tap((data) => {
              this.authService.setLogoutTimer(+data.expiresIn * 1000);
            }),
            map((data) => {
              return authentication(
                data.email,
                data.localId,
                data.idToken,
                +data.expiresIn
              );
            }),
            catchError((error) => {
              return handleError(error);
            })
          );
      })
    );
  });

  authSignup = createEffect((): Observable<any> => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      switchMap((signupAction: AuthActions.SignupStart) => {
        return this.http
          .post<AuthResponseData>(this.authSignUpURL, {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          })
          .pipe(
            tap((data) => {
              this.authService.setLogoutTimer(+data.expiresIn * 1000);
            }),
            map((data) => {
              return authentication(
                data.email,
                data.localId,
                data.idToken,
                +data.expiresIn
              );
            }),
            catchError((error) => {
              return handleError(error);
            })
          );
      })
    );
  });

  autoLogin = createEffect((): Observable<any> => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        const userData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
          return { type: 'DUMMY' };
        }

        const loadedUser = new User(
          userData.email,
          userData.id,
          userData._token,
          new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
          const expirationDuration =
            new Date(userData._tokenExpirationDate).getTime() -
            new Date().getTime();
          this.authService.setLogoutTimer(expirationDuration);
          return new AuthActions.LoginSuccess({
            email: loadedUser.email,
            id: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
          });
        }
        return { type: 'DUMMY' };
      })
    );
  });

  authLogout = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
          this.authService.clearLogoutTimer();
          localStorage.removeItem('userData');
          this.router.navigate(['/authorization']);
        })
      );
    },
    { dispatch: false }
  );

  authRedirect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.LOGIN_SUCCESS),
        tap(() => {
          this.router.navigate(['/']);
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}
