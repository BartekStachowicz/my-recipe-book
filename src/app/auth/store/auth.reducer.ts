import { User } from '../models/user.model';
import * as AuthActions from './auth.actions';

export interface State {
  user: User;
  error: string;
  loading: boolean;
}

const initState: State = {
  user: null,
  error: null,
  loading: false,
};

export function authReducer(
  state = initState,
  action: AuthActions.AuthActions
) {
  switch (action.type) {
    case AuthActions.LOGIN_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.id,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user: user,
        error: null,
        loading: false,
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null,
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGNUP_START:
      return {
        ...state,
        error: null,
        loading: true,
      };
    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        user: null,
        error: action.payload,
        loading: false,
      };
    case AuthActions.RESET_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}
