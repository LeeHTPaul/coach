export const LOG_IN = "log_in";
export const LOG_OUT = "log_out";
export const LOGIN_U = "login_user"
export const LOGOUT_U = "logout_user"
export const USER_NAME = "login_name"
export const USER_NAMEC = "login_name_clear"
export const IS_COACH = "coach_in"
export const IS_COACH_NO = "coach_no"
export const USER_NO = "user_no"
export const USER_NO_X = "user_no_x"

export function logInAction() {
  return { type: LOG_IN }
}

export function logOutAction() {
  return { type: LOG_OUT }
}

export function updateLoginAction() {
  return { type: LOGIN_U }
}

export function removeLoginAction() {
  return { type: LOGOUT_U }
}

export function updateNameAction() {
  return { type: USER_NAME }
}

export function removeNameAction() {
  return { type: USER_NAMEC }
}

export function setCoachAction() {
  return { type: IS_COACH }
}

export function removeCoachAction() {
  return { type: IS_COACH_NO }
}

export function updateUserNoAction() {
  return { type: USER_NO }
}

export function resetUserNoAction() {
  return { type: USER_NO_X }
}

const initialState = {
  token: null,
  loginuser: "",
  loginname: "",
  uphoneno: "xx",
  is_coach: null
}

export default function blogAuthReducer(state = initialState, action) {
  switch (action.type) {
    case LOG_IN:
      return { ...state, token: action.payload };
    case LOG_OUT:
      return { ...state, token: null };
    case LOGIN_U:
      return { ...state, loginuser: action.payload };
    case LOGOUT_U:
      return { ...state, loginuser: null };
    case USER_NAME:
      return { ...state, loginname: action.payload };
    case USER_NAMEC:
      return { ...state, loginname: null };
    case IS_COACH:
      return { ...state, is_coach: action.payload };
    case IS_COACH_NO:
      return { ...state, is_coach: null };
    case USER_NO:
      return { ...state, uphoneno: action.payload };
    case USER_NO_X:
      return { ...state, uphoneno: null };
    default:
      return state;
  }
}