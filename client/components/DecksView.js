import React from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import { Link, Redirect } from 'react-router-dom';
import {LoggedOutOnly} from './app-conditional';
import * as deckMeta from '../item-types/DECKS';

import ItemWrap from './item-management/ItemWrap';
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
    this.handleDelete = () => this.props.selected.forEach(id => props.deleteDeck(id));

    this.handleSave = (deckData) => {
      if(this.state.isEditing)
        this.props.updateDeck(this.props.selected[0], deckData);
      else
        this.props.addDeck(deckData);

      this.handleClose();
    };
  }

  render() {
    let {
      decks, selected,
      addDeck, updateDeck, deleteDeck,
      isSelecting, select, deselect, toggleSelecting, stopSelecting,
      sortBy, sortDesc, setSort,
      filter, setFilter, clearFilter,
      viewMode, setViewMode,
      hasHydrated,
    } = this.props;

    let {isEditing, isAdding} = this.state;

    return (
      <div
        id="decks"
        className={cn('flexible-item-manager', viewMode, {selecting: isSelecting})}
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

        <ItemWrap stopSelecting={stopSelecting}>
          <ItemSorter
            viewMode={viewMode}
            sortBy={sortBy}
            sortDesc={sortDesc}
            onSetSort={setSort}
            itemMeta={deckMeta}
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
        </ItemWrap>


        <ItemActionsBar
          actions={[
            {label:'Add Deck', icon:'plus', call: this.handleAdd},
            {label:'Edit Deck', icon:'pencil', call: this.handleEdit, disabled:selected.length != 1},
            {label:'Delete Deck', icon:'trash', call: this.handleDelete, disabled:!selected.length},
            {label:'Pull Decks', icon:'hand-lizard-o', call: _=>_}
          ]}
          numPrimary={3}
        />

        <DeckEditor
          show={isEditing || isAdding}
          initializeFrom={isEditing && selected.decks[0]}
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
    selected: getSelectedDecks(state),
    isSelecting: state.activeView.isSelecting,
    filter: state.activeView.filter,
    hasHydrated: state.hasHydrated
  };
}

import * as a from '../actions';

function mapDispatchToProps(dispatch) {
  return {
    addDeck: (deckData) => dispatch( a.addDeck(deckData) ),
    updateDeck: (id, deckData) => dispatch( a.updateDeck(id, deckData) ),
    deleteDeck: (id) => dispatch( a.deleteDeck(id) ),
    setFilter: (filter) => dispatch( a.setFilter(filter) ),
    clearFilter: () => dispatch( a.clearFilter() ),
    setSort: (by, desc) => dispatch( a.setSort('decks', by, desc) ),
    setViewMode: (mode) => dispatch( a.setViewMode('decks', mode) ),
    select: (id) => dispatch( a.select(id) ),
    deselect: (id) => dispatch( a.deselect(id) ),
    toggleSelecting: () => dispatch( a.toggleSelecting() ),
    stopSelecting: () => dispatch( a.stopSelecting() ),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecksView);

function getDeckProp(deck, prop) {
  if(prop == 'size')
    return deck.cards.length;
  else return deck[prop];
}
