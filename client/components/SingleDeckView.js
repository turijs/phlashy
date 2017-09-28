import React from 'react';
import { connect } from 'react-redux';

import FlexibleItemView from './item-management/FlexibleItemView';
import Modal from './Modal';
import { Link, Redirect } from 'react-router-dom';
import {LoggedOutOnly} from './auth-conditional';
import A from './A';

import Deck from './item-management/Deck';
import DeckEditor from './item-management/DeckEditor';
import ItemViewToolbar from './item-management/ItemViewToolbar';
import ItemSorter from './item-management/ItemSorter';
import ItemActionsBar from './item-management/ItemActionsBar';

class SingleDeckView extends React.Component {
  render() {
    return <h1>Deck {this.props.match.params.id}</h1>;
  }
}

import {
  addCard, updateCard, deleteCard,
  setFilter, clearFilter,
  setSort, setViewMode,
  select, deselect, ToggleSelecting
} from '../actions';

function mapStateToProps(state, ownProps) {
  let deckId = ownProps.match.params.id;
  let deck = state.decks[deckId];
  let cards = deck.cards.map(id => ({id, ...state.cards[id]}));

  return {
    cards,
    sortBy: state.viewPrefs.sort.cards.by,
    sortDesc: state.viewPrefs.sort.cards.desc,
    viewMode: state.viewPrefs.mode.cards,
    selected: state.activeView.selected,
    isSelecting: state.activeView.isSelecting,
    filter: state.activeView.filter,
    isEditing: state.activeView.isEditing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addCard: (cardData) => dispatch( addCard(cardData, deckId) ),
    updateCard: (id, deckData) => dispatch( updateCard(id, deckData, deckId) ),
    deleteCard: (id) => dispatch( deleteCard(id, deckId) ),
    setFilter: (filter) => dispatch( setFilter(filter) ),
    clearFilter: () => dispatch( clearFilter() ),
    setSort: (by, desc) => dispatch( setSort('cards', by, desc) ),
    setViewMode: (mode) => dispatch( setViewMode('cards', mode) ),
    select: (items, e) => dispatch( select(items) ),
    deselect: () => dispatch( deselect() ),
    toggleSelecting: () => dispatch( toggleSelecting() ),
    beginEdit: () => dispatch( beginEdit() ),
    cancelEdit: () => dispatch( cancelEdit() ),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SingleDeckView);
