import React from 'react';
import { connect } from 'react-redux';

import Modal from './Modal';
import { Link, Redirect } from 'react-router-dom';
import {LoggedOutOnly} from './app-conditional';

import FlexibleItemView from './item-management/FlexibleItemView';
import Card from './item-management/Card';
import CardEditor from './item-management/CardEditor';
import ItemViewToolbar from './item-management/ItemViewToolbar';
import ItemSorter from './item-management/ItemSorter';
import ItemActionsBar from './item-management/ItemActionsBar';

class SingleDeckView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isAdding: false, isEditing: false };

    /* helper functions */
    this.handleClose = () => this.setState({ isAdding: false, isEditing: false });
    this.handleAdd = () => this.setState({ isAdding: true });
    this.handleEdit = () => this.setState({ isEditing: true });
    this.handleDelete = () => this.props.selectedCards.forEach(card => props.deleteCard(card.id));

    this.handleSave = (cardData) => {
      if(this.state.isEditing)
        this.props.updateCard(this.props.selectedCards[0].id, cardData);
      else
        this.props.addCard(cardData);

      this.handleClose();
    }
  }

  getPlaceholder = () => {
    return !this.props.filter ?
      'This deck is currently empty. Click '+' (below) to add a card'
    : 'No matches';
  }

  render() {
    let {
      noSuchDeck,
      deck,
      cards, addCard, updateCard, deleteCard,
      selectedCards, isSelecting, select, deselect, toggleSelecting,
      sortBy, sortDesc, setSort,
      filter, setFilter, clearFilter,
      viewMode, setViewMode,
      flip,
      hasHydrated,
    } = this.props;
    let {isEditing, isAdding} = this.state;

    if(noSuchDeck) return <Redirect to="/decks" />

    return (
      <div id="cards" className={`flexible-item-manager ${viewMode}`}>

        <div className="item-manager-header">
          <h1>
            <Link to="/decks" className="deck-return">&larr;</Link>
            {deck.name || '...'}
          </h1>

          <ItemViewToolbar
            isSelecting={isSelecting}
            onToggleSelecting={toggleSelecting}
            onSetFilter={setFilter}
            viewMode={viewMode}
            onSetViewMode={setViewMode}
          />
        </div>

        <ItemSorter
          viewMode={viewMode}
          sortBy={sortBy}
          sortDesc={sortDesc}
          onSetSort={setSort}
          Item={Card}
        />

        <FlexibleItemView
          items={cards}
          itemComponent={Card}
          filter={filter}
          onSelect={select}
          onDeselect={deselect}
          isSelecting={isSelecting}
          viewMode={viewMode}
          onOpen={flip}
          placeholder="This deck is currently empty. Click '+' (below) to add a card"
          isLoading={!hasHydrated}
        />

        <ItemActionsBar
          actions={[
            {label:'Add Card', icon:'plus', call: this.handleAdd},
            {label:'Edit Card', icon:'pencil', call: this.handleEdit, disabled:selectedCards.length != 1},
            {label:'Delete Card', icon:'trash', call: this.handleDelete, disabled:!selectedCards.length},
            {label:'Pull Cards', icon:'hand-lizard-o', call: _=>_}
          ]}
          numPrimary={3}
        />

        <CardEditor
          show={isEditing || isAdding}
          card={isEditing && selectedCards[0]}
          onSave={this.handleSave}
          onCancel={this.handleClose}
        />

        <LoggedOutOnly><Redirect to="/login" /></LoggedOutOnly>
      </div>
    );
  }
}

const defaultDeck = {
  id: 'anything',
  name: '...',
  description: '...',
  cards: [],
  created: '...',
  modified: '...'
}

import {getDeck, getFlaggedCardsByDeck, getSelectedCardsByDeck} from '../selectors';

function mapStateToProps(state, ownProps) {
  let deck = getDeck(state, ownProps.match.params);
  if(!deck)
    if(state.hasHydrated) // assume deck doesn't exist
      return {noSuchDeck: true};
    else deck = defaultDeck; // temporary values until real ones are loaded

  return {
    deck,
    cards: getFlaggedCardsByDeck(state, deck),
    sortBy: state.prefs.view.sort.cards.by,
    sortDesc: state.prefs.view.sort.cards.desc,
    viewMode: state.prefs.view.mode.cards,
    selectedCards: getSelectedCardsByDeck(state, deck),
    isSelecting: state.activeView.isSelecting,
    filter: state.activeView.filter,
    hasHydrated: state.hasHydrated
  };
}

import {
  addCard, updateCard, deleteCard,
  setFilter, clearFilter,
  setSort, setViewMode,
  select, deselect, toggleSelecting,
  flipCards
} from '../actions';

function mapDispatchToProps(dispatch, ownProps) {
  let deckId = ownProps.match.params.id;
  return {
    addCard: (cardData) => dispatch( addCard(cardData, deckId) ),
    updateCard: (id, cardData) => dispatch( updateCard(id, cardData, deckId) ),
    deleteCard: (id) => dispatch( deleteCard(id, deckId) ),
    setFilter: (filter) => dispatch( setFilter(filter) ),
    clearFilter: () => dispatch( clearFilter() ),
    setSort: (by, desc) => dispatch( setSort('cards', by, desc) ),
    setViewMode: (mode) => dispatch( setViewMode('cards', mode) ),
    select: (id) => dispatch( select(id) ),
    deselect: (id) => dispatch( deselect(id) ),
    toggleSelecting: () => dispatch( toggleSelecting() ),
    flip: (id) => dispatch( flipCards([id]) )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SingleDeckView);
