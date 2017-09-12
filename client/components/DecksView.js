import React from 'react';
import { connect } from 'react-redux';
import FlexibleItemView from './FlexibleItemView';
import Modal from './Modal';
import { Link, Redirect } from 'react-router-dom';
import Tappable from 'react-tappable/lib/Tappable';
import {LoggedOutOnly} from './auth-conditional';

import {
  addDeck, deleteDeck,
  setFilter, clearFilter,
  setSort,
  select, deselect,
  beginEdit, cancelEdit
} from '../actions';

function Deck({id, name, onMouseDown, onClick, onPress, isSelected}) {
  let selClass = isSelected ? 'selected' : '';
  return (
    <Link to={`/decks/${id}`}>
      <Tappable
        className={`deck ${selClass}`}
        onMouseDown={onMouseDown}
        onClick={onClick}
        onPress={onPress}
        pressDelay={600}
      >
        <div className="deck-name">{name}</div>
      </Tappable>
    </Link>

  )
}
Deck.filterableProps = ['name'];



class EditDeckModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = this.getNewState();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.deck != this.props.deck)
      this.setState( this.getNewState() );
  }

  getNewState() {
    let deck = this.props.deck;
    if(!deck || deck == 'NEW')
      return {name: '', description: ''}

    return {name: deck.name, description: deck.description};
  }

  handleChange(e) {
    let {name, value} = e.target;
    this.setState({[name]: value});
  }

  handleSubmit(e) {
    e.preventDefault();
    let {name, description} = this.state;
    this.props.onSave({name, description});
  }

  render() {
    let {deck, onCancel, onSave, ...rest} = this.props;
    let {name, description} = this.state;
    return (
      <Modal show={!!deck} onClickOutside={onCancel} className="edit-deck-modal" {...rest}>
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <input type="text" name="name" value={name} placeholder="Name" />
          <textarea name="description" value={description} placeholder="Description" />
        </form>
        <div className="btn-row">
          <button onClick={onCancel}>Cancel</button>
          <button className="btn-go" onClick={this.handleSubmit}>Save</button>
        </div>
      </Modal>
    );
  }
}

class DecksView extends React.Component {
  constructor(props) {
    super(props);

    this.toggleModal = this.toggleModal.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      newDeck: false,
      filter: '',
      sort: 'name',
      selectedItems: {}
    }
  }

  toggleModal() {
    this.setState({newDeck: !this.state.newDeck});
  }

  handleSave(deckData) {
    this.props.addDeck(deckData);
  }

  handleDelete() {
    for(let id of this.props.selectedDecks)
      this.props.deleteDeck(id);
  }

  render() {
    let {
      decks, sortBy, sortDesc, selectedDecks, selectMode, filter, beginEdit, cancelEdit,
      addDeck, deleteDeck, setFilter, clearFilter, setSort, select, deselect, editing
    } = this.props;

    // replace ID with deck that it references
    editing = decks[editing] || editing;

    return (
      <div id="decks">
        <h1>Decks</h1>

        <input
          type="text"
          onChange={e => setFilter(e.target.value)}
          placeholder="filter by name"
          style={{padding: 2}}
        /> &nbsp;

        Sort:
        <select value={sortBy} onChange={e => setSort(e.target.value, false)}>
          <option value="created">Date Created</option>
          <option value="name">Name</option>
        </select> &nbsp;

        Select Mode? &nbsp;
        <input
          type="checkbox"
          checked={selectMode}
          onChange={e => selectMode ? deselect() : select([])}
        />

        <FlexibleItemView
          items={decks}
          itemComponent={Deck}
          filter={filter}
          sortBy={sortBy}
          selectedItems={selectedDecks}
          onSelect={select}
          selectMode={selectMode}
        />

        <button className="btn-stop" disabled={!selectedDecks.length} onClick={this.handleDelete}>Delete</button>
        <button onClick={() => beginEdit()}>Add</button>

        <EditDeckModal deck={editing} onCancel={cancelEdit} onSave={this.handleSave}/>

        <LoggedOutOnly><Redirect to="/login" /></LoggedOutOnly>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let decks = [];
  for(let id in state.decks)
    decks.push({id, ...state.decks[id]});

  return {
    decks,
    sortBy: state.viewPrefs.sort.decks.by,
    sortDesc: state.viewPrefs.sort.decks.desc,
    selectedDecks: state.activeView.selected,
    selectMode: state.activeView.selectMode,
    filter: state.activeView.filter,
    editing: state.activeView.editingItem
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addDeck: (deckData) => dispatch( addDeck(deckData) ),
    deleteDeck: (id) => dispatch( deleteDeck(id) ),
    setFilter: (filter) => dispatch( setFilter(filter) ),
    clearFilter: () => dispatch( clearFilter() ),
    setSort: (by, desc) => dispatch ( setSort('decks', by, desc) ),
    select: (items, e) => dispatch( select(items) ),
    deselect: () => dispatch( deselect() ),
    beginEdit: (id) => dispatch( beginEdit(id) ),
    cancelEdit: () => dispatch( cancelEdit() ),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecksView);
