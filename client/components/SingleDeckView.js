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
  constructor(props) {
    super(props);

    this.state = { isAdding: false, isEditing: false };

    /* helper functions */
    this.handleClose = () => this.setState({ isAdding: false, isEditing: false });
    this.handleAdd = () => this.setState({ isAdding: true });
    this.handleEdit = () => this.setState({ isEditing: true });
    this.handleDelete = () => this.props.selected.forEach(id => props.deleteCard(id));

    this.handleSave = (cardData) => {
      if(this.state.isEditing)
        this.props.updateCard(this.props.selected[0], cardData);
      else
        this.props.addCard(cardData);

      this.handleClose();
    }
  }



  render() {
    let {
      noSuchDeck,
      deck,
      cards, addCard, updateCard, deleteCard,
      selected, isSelecting, select, deselect, toggleSelecting, stopSelecting,
      sortBy, sortDesc, setSort,
      filter, setFilter, clearFilter,
      viewMode, setViewMode,
      flip,
      hasHydrated,
    } = this.props;
    let {isEditing, isAdding} = this.state;

    if(noSuchDeck) return <Redirect to="/decks" />

    return (
      <div id="cards" className={cn('flexible-item-manager', viewMode, {selecting: isSelecting})}>

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
            {label:'Add Card', icon:'plus', call: this.handleAdd},
            {label:'Edit Card', icon:'pencil', call: this.handleEdit, disabled:selected.length != 1},
            {label:'Delete Card', icon:'trash', call: this.handleDelete, disabled:!selected.length},
          ]}
          numPrimary={3}
        />

        <CardEditor
          show={isEditing || isAdding}
          initializeFrom={isEditing && selected.cards[0]}
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

import {getDeck, getFlaggedCardsByDeck, getSelectedCards} from '../selectors';

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
    selected: getSelectedCards(state),
    isSelecting: state.activeView.isSelecting,
    filter: state.activeView.filter,
    hasHydrated: state.hasHydrated
  };
}

import * as a from '../actions';

function mapDispatchToProps(dispatch, ownProps) {
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
    toggleSelecting: () => dispatch( a.toggleSelecting() ),
    stopSelecting: () => dispatch( a.stopSelecting() ),
    flip: (id) => dispatch( a.flip([id]) )
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(SingleDeckView);
