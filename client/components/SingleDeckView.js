import React from 'react';
import { connect } from 'react-redux';
import * as cardMeta from '../item-types/CARDS';
import cn from 'classnames'

import { Link, Redirect } from 'react-router-dom';
import {LoggedOutOnly} from './app-conditional';
import Keyboard from './Keyboard';

import ItemWrap from './item-management/ItemWrap';
import FlexibleItemView from './item-management/FlexibleItemView';
import Card from './item-management/Card';
import CardEditor from './item-management/CardEditor';
import ItemViewToolbar from './item-management/ItemViewToolbar';
import ItemSorter from './item-management/ItemSorter';
import ItemActionsBar from './item-management/ItemActionsBar';

class SingleDeckView extends React.Component {
  render() {
    let {
      noSuchDeck,
      deck, cards, selected,
      addCard, updateSelected, deleteSelected,
      beginAdd, beginEdit, endActivity,
      isSelecting, allSelected,
      select, deselect, selectAll, selectNone,
      toggleSelecting, stopSelecting,
      sortBy, sortDesc, setSort,
      filter, setFilter, clearFilter,
      viewMode, setViewMode,
      activity,
      flip, flipSelected,
      hasHydrated,
    } = this.props;

    if(noSuchDeck) return <Redirect to="/decks" />

    return (
      <div id="single-deck" className={cn('flexible-item-manager', viewMode, {selecting: isSelecting})}>

        <Keyboard />

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

        <ItemWrap stopSelecting={stopSelecting}>
          <ItemSorter
            viewMode={viewMode}
            sortBy={sortBy}
            sortDesc={sortDesc}
            onSetSort={setSort}
            onSelectAll={selectAll}
            onSelectNone={selectNone}
            allSelected={allSelected}
            itemMeta={cardMeta}
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
        </ItemWrap>


        <ItemActionsBar
          actions={[
            {label:'Add Card', icon:'plus', call: beginAdd},
            {label:'Edit Card', icon:'pencil', call: beginEdit, disabled:selected.length != 1},
            {label:'Delete Card', icon:'trash', call: deleteSelected, disabled:!selected.length},
            {label:'Flip Selected', icon:'repeat', call: flipSelected, disabled: !selected.length},
          ]}
          numPrimary={3}
        />

        <CardEditor
          show={activity == 'adding'}
          onSave={addCard}
          onClose={endActivity}
        />
        <CardEditor
          show={activity == 'editing'}
          initializeFrom={selected.cards[0]}
          onSave={updateSelected}
          onCancel={endActivity}
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

import {
  getDeck,
  getFlaggedCardsByDeck,
  getSelectedCards,
  areAllSelected
} from '../selectors';

function mapState(state, ownProps) {
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
    selected: getSelectedCards(state),
    isSelecting: state.activeView.isSelecting,
    allSelected: areAllSelected(state),
    filter: state.activeView.filter,
    activity: state.activeView.activity,
    hasHydrated: state.hasHydrated
  };
}

import * as a from '../actions';

function mapDispatch(dispatch, ownProps) {
  let deckId = ownProps.match.params.id;
  return {
    addCard: (cardData) => dispatch( a.addCard(cardData, deckId) ),
    updateCard: (id, cardData) => dispatch( a.updateCard(id, cardData, deckId) ),
    deleteCard: (id) => dispatch( a.deleteCard(id, deckId) ),
    setFilter: (filter) => dispatch( a.setFilter(filter) ),
    clearFilter: () => dispatch( a.clearFilter() ),
    setSort: (by, desc) => dispatch( a.setSort('cards', by, desc) ),
    setViewMode: (mode) => dispatch( a.setViewMode('cards', mode) ),
    select: (id) => dispatch( a.select(id) ),
    deselect: (id) => dispatch( a.deselect(id) ),
    selectAll: () => dispatch( a.selectAll() ),
    selectNone: () => dispatch( a.selectNone() ),
    toggleSelecting: () => dispatch( a.toggleSelecting() ),
    stopSelecting: () => dispatch( a.stopSelecting() ),
    flip: (ids) => dispatch( a.flip(ids) ),
    beginAdd: () => dispatch( a.beginActivity('adding') ),
    beginEdit: () => dispatch( a.beginActivity('editing') ),
    endActivity: () => dispatch( a.endActivity() ),
  }
}

function mergeProps(stateProps, actionProps, ownProps) {
  return {...stateProps, ...actionProps, ...ownProps,
    updateSelected: cardData => actionProps.updateCard(stateProps.selected[0], cardData),
    deleteSelected: () => stateProps.selected.forEach(id => actionProps.deleteCard(id)),
    flipSelected: () => actionProps.flip( stateProps.selected ),
  }
}


export default connect(mapState, mapDispatch, mergeProps)(SingleDeckView);
