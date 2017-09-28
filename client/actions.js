import generateTempID from './util/generate-temp-id';

export const LOGIN = 'LOGIN';
export function login(userData, automatic = false) {
  return {type: LOGIN, userData, automatic}
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
    id: generateTempID(),
    deckData: {
      name,
      description,
      created: new Date().toJSON(),
      modified: new Date().toJSON()
    },
    outbound: true
  }
}

export const UPDATE_DECK = 'UPDATE_DECK';
export function updateDeck(id, {name, description}) {
  return {
    type: UPDATE_DECK,
    id,
    deckData: {
      name,
      description,
      modified: new Date().toJSON()
    }
  }
}

export const ADD_DECK_COMMIT = 'ADD_DECK_COMMIT';
export function addDeckCommit(id, deckData, tempId = false) {
  return {type: ADD_DECK_COMMIT, id, deckData, tempId, shouldDequeueOutbound: true}
}

export const DELETE_DECK = 'DELETE_DECK';
export function deleteDeck(id) {
  return {type: DELETE_DECK, id, outbound: true}
}

/*========== Cards ===========*/

// note: all card actions must have a 'date' field, which is
// used for updating 'date modified' on the corresponding deck

export const ADD_CARD = 'ADD_CARD';
export function addCard({front, back}, deckId) {
  let date = new Date().toJSON();
  return {
    type: ADD_CARD,
    id: generateTempID(),
    deckData: {
      front,
      back,
      created: date,
      modified: date
    },
    deckId,
    date,
    // outbound: true
  }
}

export const UPDATE_CARD = 'UPDATE_CARD';
export function updateCard(id, {front, back}, deckId) {
  let date = new Date().toJSON();
  return {
    type: UPDATE_CARD,
    id,
    deckData: {
      front,
      back,
      modified: date
    },
    deckId,
    date
  }
}

export const ADD_CARD_COMMIT = 'ADD_CARD_COMMIT';
export function addCardCommit(id, cardData, deckId, tempId = false) {
  return {
    type: ADD_CARD_COMMIT,
    id,
    cardData,
    deckId,
    tempId,
    date: cardData.modified,
  /*shouldDequeueOutbound: true*/}
}

export const DELETE_CARD = 'DELETE_CARD';
export function deleteCard(id, deckId) {
  let date = new Date().toJSON();
  return {type: DELETE_CARD, id, deckId, date, /*outbound: true*/}
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
export function beginEdit() {
  return {type: BEGIN_EDIT}
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

export const TOGGLE_SELECTING = 'TOGGLE_SELECTING';
export const toggleSelecting = $basicAC(TOGGLE_SELECTING);

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

export const SKIP_REHYDRATION  = 'SKIP_REHYDRATION';
export function skipRehydration() {
  return {type: SKIP_REHYDRATION}
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

/*===== Helper functions =====*/

function $basicAC(type, ...params) {
  return (...args) => {
    let action = {type};
    for(let i = 0; i < params.length; i++)
      action[params[i]] = args[i];
    return action;
  }
}
