import React from 'react';
import { connect } from 'react-redux';

import Modal from './Modal';
import { Link, Redirect } from 'react-router-dom';
import {LoggedOutOnly} from './auth-conditional';

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
    this.handleDelete = () => this.props.selectedDecks.forEach(id => props.deleteDeck(id));

    this.handleSave = (deckData) => {
      if(this.state.isEditing)
        this.props.updateDeck(this.props.selectedDecks[0], deckData);
      else
        this.props.addDeck(deckData);

      this.handleClose();
    };
  }

  render() {
    let {
      decks, addDeck, updateDeck, deleteDeck,
      selectedDecks, isSelecting, select, toggleSelecting,
      sortBy, sortDesc, setSort,
      filter, setFilter, clearFilter,
      viewMode, setViewMode,
    } = this.props;

    let {isEditing, isAdding} = this.state;

    return (
      <div id="decks" className={`flexible-item-manager ${viewMode}`}>

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
          sortDesc={sortDesc}
          selectedItems={selectedDecks}
          onSelect={select}
          isSelecting={isSelecting}
          viewMode={viewMode}
        />

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
          deck={isEditing && decks.find(({id}) => id == selectedDecks[0])}
          onSave={this.handleSave}
          onCancel={this.handleClose}
        />

        <LoggedOutOnly><Redirect to="/login" /></LoggedOutOnly>
      </div>
    );
  }
}

import {
  addDeck, deleteDeck, updateDeck,
  setFilter, clearFilter,
  setSort, setViewMode,
  select, deselect, toggleSelecting,
  beginEdit, cancelEdit
} from '../actions';

function mapStateToProps(state) {
  let decks = [];
  for(let id in state.decks)
    decks.push({id, ...state.decks[id]});

  return {
    decks,
    sortBy: state.viewPrefs.sort.decks.by,
    sortDesc: state.viewPrefs.sort.decks.desc,
    viewMode: state.viewPrefs.mode.decks,
    selectedDecks: state.activeView.selected,
    isSelecting: state.activeView.isSelecting,
    filter: state.activeView.filter,
    isEditing: state.activeView.isEditing
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addDeck: (deckData) => dispatch( addDeck(deckData) ),
    updateDeck: (id, deckData) => dispatch( updateDeck(id, deckData) ),
    deleteDeck: (id) => dispatch( deleteDeck(id) ),
    setFilter: (filter) => dispatch( setFilter(filter) ),
    clearFilter: () => dispatch( clearFilter() ),
    setSort: (by, desc) => dispatch( setSort('decks', by, desc) ),
    setViewMode: (mode) => dispatch( setViewMode('decks', mode) ),
    select: (items, e) => dispatch( select(items) ),
    deselect: () => dispatch( deselect() ),
    toggleSelecting: () => dispatch( toggleSelecting() ),
    beginEdit: () => dispatch( beginEdit() ),
    cancelEdit: () => dispatch( cancelEdit() ),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecksView);
