/* local storage */
export enum LocalStorageEntryName { //TODO: remove some keys due to Amplify integration. OIDC key should be should be left unchanged.
  cognito = "cognito",
  JGTwitterOIDC = "JGTwitterOIDC",
}
export enum CognitoLocalStorageSubEntryName {
  cognitoAccessToken = "cognitoAccessToken",
  cognitoRefreshToken = "cognitoRefreshToken",
  cognitoIdToken = "cognitoIdToken",

  authorizeStateString = "authorizeStateString",
  cognitoCodeVerifier = "cognitoCodeVerifier",
}
export enum JGTwitterOIDCLocalStorageSubEntryName {
  cognitoRedirectUri = "cognitoRedirectUri",
  cognitoJGTwitterOIDCState = "cognitoJGTwitterOIDCState",
  removedScopeFieldsFromCognitoScopeString = "removedScopeFieldsFromCognitoScopeString",
  scopeFromCognito = "scopeFromCognito",

  JGTwitterOIDCTwitterState = "JGTwitterOIDCTwitterState",
  JGTwitterOIDCTwitterCodeVerifier = "JGTwitterOIDCTwitterCodeVerifier",
}

/**
 * The purpose of this function to set the subEntry of entry in localStorage
 * @param entryKey
 * @param entrySubKey
 */
export function setLocalStorageSubEntry(entryKey: string, subEntryKey: string, subEntryValue: string): void {
  const entryString = localStorage.getItem(entryKey);
  let localStorageEntry;
  if (!entryString) {
    localStorageEntry = {};
  } else {
    localStorageEntry = JSON.parse(entryString);
  }
  localStorageEntry[subEntryKey] = subEntryValue;
  localStorage.setItem(entryKey, JSON.stringify(localStorageEntry));
}
export function getLocalStorageSubEntry(entryKey: string, subEntryKey: string): any {
  const entryString = localStorage.getItem(entryKey);
  if (!entryString) {
    return undefined;
  }
  return JSON.parse(entryString)[subEntryKey];
}
export function removeLocalStorageSubEntry(entryKey: string, subEntryKey: string): void {
  const subEntry = getLocalStorageSubEntry(entryKey, subEntryKey);
  const entryString = localStorage.getItem(entryKey);
  let localStorageEntry;
  if (entryString) {
    localStorageEntry = JSON.parse(entryString);
    delete localStorageEntry[subEntryKey];
    localStorage.setItem(entryKey, JSON.stringify(localStorageEntry));
  }
  return subEntry;
}
/* /local storage */

/* Cookie */
export function setCookie(cookieName: string, cookieValue: string) {
  document.cookie = cookieName + "=" + cookieValue + "; Path=/;";
}

export function removeCookie(cookieName: string): void {
  document.cookie = cookieName + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
/* /Cookie */
