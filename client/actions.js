import generateTempID from './util/generate-temp-id';

export const LOGIN = 'LOGIN';
export function login(userData) {
  return {type: LOGIN, userData}
}

export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export function requestLogout() {
  return {type: REQUEST_LOGOUT}
}

export const LOGOUT = 'LOGOUT';
export function logout() {
  return {type: LOGOUT}
}

export const LOGOUT_FAILED = 'LOGOUT_FAILED';
export function logoutFailed() {
  return {type: LOGOUT_FAILED}
}

export const UPDATE_USER = 'UPDATE_USER';
export function updateUser(userData) {
  return {type: UPDATE_USER, userData}
}


export const ADD_DECK = 'ADD_DECK';
export function addDeck(deckData, replaceTemp = false) {
  return {type: ADD_DECK, deckData, replaceTemp}
}

export const ADD_DECK_TEMP = 'ADD_DECK_TEMP';
export function addDeckTemp({name, description}) {
  return {
    type: ADD_DECK_TEMP,
    deckData: {
      id: generateTempID(),
      name,
      description,
      created: new Date().toJSON(),
      modified: new Date().toJSON()
    }
  }
}

export const DELETE_DECK = 'DELETE_DECK';
export function deleteDeck(id) {
  return {type: DELETE_DECK, id}
}

export const FETCH_DECKS = 'FETCH_DECKS';
export function fetchDecks() {
  return {type: FETCH_DECKS}
}

export const LOAD_DECKS = 'LOAD_DECKS';
export function loadDecks(decks) {
  return {type: LOAD_DECKS, decks}
}
