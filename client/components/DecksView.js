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
import DeleteDecksConfirm from './item-management/DeleteDecksConfirm';

class DecksView extends React.Component {
  handleDelete = () => {
    let {selected, deleteSelected, confirmDelete} = this.props;

    this.selectedDecksCardCount = selected.decks.reduce( (sum, deck) => sum + deck.cards.length, 0 );

    if(this.selectedDecksCardCount > 0)
      confirmDelete()
    else
      deleteSelected()
  }

  render() {
    let {
      decks, selected,
      addDeck, updateSelected, deleteSelected,
      beginAdd, beginEdit, confirmDelete, endActivity,
      isSelecting, allSelected,
      select, deselect, selectAll, selectNone,
      toggleSelecting, stopSelecting,
      sortBy, sortDesc, setSort,
      filter, setFilter, clearFilter,
      viewMode, setViewMode,
      activity,
      hasHydrated,
    } = this.props;
    let {handleDelete} = this;

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
            onSelectAll={selectAll}
            onSelectNone={selectNone}
            allSelected={allSelected}
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
            {label:'Add Deck', icon:'plus', call: beginAdd},
            {label:'Edit Deck', icon:'pencil', call: beginEdit, disabled: selected.length != 1},
            {label:'Delete Deck', icon:'trash', call: handleDelete, disabled: !selected.length},
          ]}
          numPrimary={3}
        />

        <DeckEditor
          show={activity == 'adding'}
          onSave={addDeck}
          onClose={endActivity}
        />

        <DeckEditor
          show={activity == 'editing'}
          initializeFrom={selected.decks[0]}
          onSave={updateSelected}
          onClose={endActivity}
        />

        <DeleteDecksConfirm
          show={activity == 'deleting'}
          onConfirm={deleteSelected}
          onClose={endActivity}
          decksCount={selected.length}
          cardsCount={this.selectedDecksCardCount}
        />

        <LoggedOutOnly><Redirect to="/login" /></LoggedOutOnly>
      </div>
    );
  }
}

import { getFlaggedDecks, getSelectedDecks, areAllSelected } from '../selectors';

function mapState(state) {
  return {
    decks: getFlaggedDecks(state),
    sortBy: state.prefs.view.sort.decks.by,
    sortDesc: state.prefs.view.sort.decks.desc,
    viewMode: state.prefs.view.mode.decks,
    selected: getSelectedDecks(state),
    isSelecting: state.activeView.isSelecting,
    allSelected: areAllSelected(state),
    filter: state.activeView.filter,
    activity: state.activeView.activity,
    hasHydrated: state.hasHydrated
  };
}

import * as a from '../actions';

function mapDispatch(dispatch) {
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
    selectAll: () => dispatch( a.selectAll() ),
    selectNone: () => dispatch( a.selectNone() ),
    toggleSelecting: () => dispatch( a.toggleSelecting() ),
    stopSelecting: () => dispatch( a.stopSelecting() ),
    beginAdd: () => dispatch( a.beginActivity('adding') ),
    beginEdit: () => dispatch( a.beginActivity('editing') ),
    confirmDelete: () => dispatch( a.beginActivity('deleting') ),
    endActivity: () => dispatch( a.endActivity() ),
  }
}

function mergeProps(stateProps, actionProps, ownProps) {
  return {...stateProps, ...actionProps, ...ownProps,
    updateSelected: deckData => actionProps.updateDeck(stateProps.selected[0], deckData),
    deleteSelected: () => stateProps.selected.forEach(id => actionProps.deleteDeck(id)),
  }
}

export default connect(mapState, mapDispatch, mergeProps)(DecksView);
