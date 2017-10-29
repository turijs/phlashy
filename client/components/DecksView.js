import React from 'react';
import { connect } from 'react-redux';

import { Link, Redirect } from 'react-router-dom';
import {LoggedOutOnly} from './app-conditional';

import FlexibleItemView from './item-management/FlexibleItemView';
import Deck from './item-management/Deck';
import DeckEditor from './item-management/DeckEditor';
import ItemViewToolbar from './item-management/ItemViewToolbar';
import ItemSorter from './item-management/ItemSorter';
import ItemActionsBar from './item-management/ItemActionsBar';

class DecksView extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isAdding: false, isEditing: false };

    // helper functions
    this.handleClose = () => this.setState({ isAdding: false, isEditing: false });
    this.handleAdd = () => this.setState({ isAdding: true });
    this.handleEdit = () => {this.setState({ isEditing: true })};
    this.handleDelete = () => this.props.selectedDecks.forEach(deck => props.deleteDeck(deck.id));

    this.handleSave = (deckData) => {
      if(this.state.isEditing)
        this.props.updateDeck(this.props.selectedDecks[0].id, deckData);
      else
        this.props.addDeck(deckData);

      this.handleClose();
    };
  }

  handleBaseClick = e => {
    if( e.target.getAttribute('data-deselect') && this.props.isSelecting )
      this.props.toggleSelecting();
  }

  render() {
    let {
      decks, selectedDecks,
      addDeck, updateDeck, deleteDeck,
      isSelecting, select, deselect, toggleSelecting,
      sortBy, sortDesc, setSort,
      filter, setFilter, clearFilter,
      viewMode, setViewMode,
      hasHydrated,
    } = this.props;

    let {isEditing, isAdding} = this.state;

    return (
      <div
        id="decks"
        className={`flexible-item-manager ${viewMode}`}
        onClick={this.handleBaseClick}
      >

        <div className="item-manager-header">
          <h1>Decks</h1>

          <ItemViewToolbar
            isSelecting={isSelecting}
            onToggleSelecting={toggleSelecting}
            onSetFilter={setFilter}
            viewMode={viewMode}
            onSetViewMode={setViewMode}
          />
        </div>

        <div className="list-wrap" data-deselect>
          <ItemSorter
            viewMode={viewMode}
            sortBy={sortBy}
            sortDesc={sortDesc}
            onSetSort={setSort}
            Item={Deck}
          />

          <FlexibleItemView
            items={decks}
            itemComponent={Deck}
            filter={filter}
            sortBy={sortBy}
            onSelect={select}
            onDeselect={deselect}
            isSelecting={isSelecting}
            viewMode={viewMode}
            placeholder="You have no decks. Click '+' (below) to create one"
            isLoading={!hasHydrated}
          />
        </div>


        <ItemActionsBar
          actions={[
            {label:'Add Deck', icon:'plus', call: this.handleAdd},
            {label:'Edit Deck', icon:'pencil', call: this.handleEdit, disabled:selectedDecks.length != 1},
            {label:'Delete Deck', icon:'trash', call: this.handleDelete, disabled:!selectedDecks.length},
            {label:'Pull Decks', icon:'hand-lizard-o', call: _=>_}
          ]}
          numPrimary={3}
        />

        <DeckEditor
          show={isEditing || isAdding}
          deck={isEditing && selectedDecks[0]}
          onSave={this.handleSave}
          onCancel={this.handleClose}
        />

        <LoggedOutOnly><Redirect to="/login" /></LoggedOutOnly>
      </div>
    );
  }
}

import { getFlaggedDecks, getSelectedDecks } from '../selectors';

function mapStateToProps(state) {
  return {
    decks: getFlaggedDecks(state),
    sortBy: state.prefs.view.sort.decks.by,
    sortDesc: state.prefs.view.sort.decks.desc,
    viewMode: state.prefs.view.mode.decks,
    selectedDecks: getSelectedDecks(state),
    isSelecting: state.activeView.isSelecting,
    filter: state.activeView.filter,
    hasHydrated: state.hasHydrated
  };
}

import {
  addDeck, deleteDeck, updateDeck,
  setFilter, clearFilter,
  setSort, setViewMode,
  select, deselect, toggleSelecting,
} from '../actions';

function mapDispatchToProps(dispatch) {
  return {
    addDeck: (deckData) => dispatch( addDeck(deckData) ),
    updateDeck: (id, deckData) => dispatch( updateDeck(id, deckData) ),
    deleteDeck: (id) => dispatch( deleteDeck(id) ),
    setFilter: (filter) => dispatch( setFilter(filter) ),
    clearFilter: () => dispatch( clearFilter() ),
    setSort: (by, desc) => dispatch( setSort('decks', by, desc) ),
    setViewMode: (mode) => dispatch( setViewMode('decks', mode) ),
    select: (id) => dispatch( select(id) ),
    deselect: (id) => dispatch( deselect(id) ),
    toggleSelecting: () => dispatch( toggleSelecting() ),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecksView);

function getDeckProp(deck, prop) {
  if(prop == 'size')
    return deck.cards.length;
  else return deck[prop];
}
