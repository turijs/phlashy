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

/*========== Decks ===========*/

export const ADD_DECK = 'ADD_DECK';
export function addDeck({name, description}) {
  return {
    type: ADD_DECK,
    deckData: {
      id: generateTempID(),
      name,
      description,
      created: new Date().toJSON(),
      modified: new Date().toJSON()
    },
    outbound: true
  }
}

export const ADD_DECK_COMMIT = 'ADD_DECK_COMMIT';
export function addDeckCommit(deckData, replaceTemp = false) {
  return {type: ADD_DECK_COMMIT, deckData, replaceTemp, shouldDequeueOutbound: true}
}

export const DELETE_DECK = 'DELETE_DECK';
export function deleteDeck(id) {
  return {type: DELETE_DECK, id, outbound: true}
}

export const FETCH_DECKS = 'FETCH_DECKS';
export function fetchDecks() {
  return {type: FETCH_DECKS}
}

export const LOAD_DECKS = 'LOAD_DECKS';
export function loadDecks(decks) {
  return {type: LOAD_DECKS, decks}
}

/*======== Decks & Cards General ========*/

export const REFRESH = 'REFRESH';
export function refresh(auto = false) {
  return {type: REFRESH, auto};
}

export const REFRESH_SUCCEEDED = 'REFRESH_SUCCEEDED';
export function refresh_succeeded(decks, cards) {
  return {type: REFRESH_SUCCEEDED, cards, decks};
}

export const REFRESH_FAILED = 'REFRESH_FAILED';
export function refresh_failed() {
  return {type: REFRESH_FAILED};
}

/*====== Active Item View =======*/

export const BEGIN_EDIT = 'BEGIN_EDIT';
export function beginEdit(item = 'NEW') {
  return {type: BEGIN_EDIT, item}
}

export const CANCEL_EDIT = 'CANCEL_EDIT';
export function cancelEdit() {
  return {type: CANCEL_EDIT}
}

export const SELECT = 'SELECT';
export function select(items) {
  return {type: SELECT, items}
}

export const DESELECT = 'DESELECT';
export function deselect() {
  return {type: DESELECT}
}

export const SET_FILTER = 'SET_FILTER';
export function setFilter(filter) {
  return {type: SET_FILTER, filter}
}

export const CLEAR_FILTER = 'CLEAR_FILTER';
export function clearFilter() {
  return {type: CLEAR_FILTER}
}

export const SET_SORT = 'SET_SORT';
export function setSort(itemType, by, desc = false) {
  return {
    type: SET_SORT,
    itemType,
    sort: { by, desc }
  }
}

export const SET_VIEW_MODE = 'SET_VIEW_MODE';
export function setViewMode(itemType, mode) {
  return {type: SET_VIEW_MODE, itemType, mode}
}

/*======== Connection ========== */

export const CONNECTION_LOST  = 'CONNECTION_LOST';
export function connectionLost() {
  return {type: CONNECTION_LOST}
}

export const CONNECTION_GAINED  = 'CONNECTION_GAINED';
export function connectionGained() {
  return {type: CONNECTION_GAINED}
}

/*======== Other ========== */

export function genericActionCommit(action) {
  return {
    type: action.type + '_COMMIT',
    shouldDequeueOutbound: action.outbound
  }
}

export function genericActionFailed(action) {
  return {
    type: action.type + '_FAILED',
    shouldDequeueOutbound: action.outbound
  }
}

export const SHOW_MODAL = 'SHOW_MODAL';
export function showModal(modalName) {
  return {type: SHOW_MODAL, modalName}
}

export const HIDE_MODAL = 'HIDE_MODAL';
export function hideModal() {
  return {type: HIDE_MODAL}
}

export const DEQUEUE_OUTBOUND  = 'DEQUEUE_OUTBOUND';
export function dequeueOutbound() {
  return {type: DEQUEUE_OUTBOUND}
}
