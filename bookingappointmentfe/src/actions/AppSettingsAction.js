import { LOGIN_DATA } from "./types"
export const setLoginData = (data) => ({
    type: LOGIN_DATA,
    payload: data,
  })
  