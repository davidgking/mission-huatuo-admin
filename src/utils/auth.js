import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const appKey = 'APP-ID-KEY'

export function getAppId() {
  return Cookies.get(appKey)
}

export function setAppId(token) {
  return Cookies.set(appKey, token)
}

export function removeAppId() {
  return Cookies.remove(appKey)
}
