import React from 'react';
import { connect } from 'react-redux';

import FlexibleItemView from './FlexibleItemView';
import Modal from './Modal';
import { Link, Redirect } from 'react-router-dom';
import {LoggedOutOnly} from './auth-conditional';
import SelectMode from './SelectMode';
import Pressable from './Pressable';
import A from './A';
import Icon from './Icon';
import Select from 'react-select';
import RadioBar from './RadioBar';

import renderDate from '../util/render-date';


import {
  addDeck, deleteDeck,
  setFilter, clearFilter,
  setSort, setViewMode,
  select, deselect,
  beginEdit, cancelEdit
} from '../actions';

function Deck({
  id,
  name,
  description,
  created,
  modified,
  onMouseDown,
  onClick,
  onPress,
  isSelected
}) {
  let selClass = isSelected ? 'selected' : '';
  return (
    <Link to={`/decks/${id}`}>
      <Pressable
        className={`deck ${selClass}`}
        onDown={onMouseDown}
        onClick={onClick}
        onPress={onPress}
        pressDelay={600}
      >
        <div className="deck-name">{name}</div>
        <div className="deck-description">{description}</div>
        <div className="deck-modified">{renderDate(modified)}</div>
        <div className="deck-created">{renderDate(created)}</div>
      </Pressable>
    </Link>

  )
}
Deck.publicProps = [
  {value: 'name', label: 'Name'},
  {value: 'description', label: 'Description'},
  {value: 'modified', label: 'Date Modified'},
  {value: 'created', label: 'Date Created'},
]
Deck.filterableProps = ['name'];
Deck.prefix = 'deck';



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
      addDeck, deleteDeck, setFilter, clearFilter, setSort, select, deselect, editing,
      viewMode, setViewMode,
    } = this.props;

    // replace ID with deck that it references
    editing = decks[editing] || editing;

    return (
      <div id="decks" className={`flexible-item-manager ${viewMode}`}>

        <div className="item-manager-header">
          <div className="container">
            <h1>Decks</h1>

            <div className="item-view-toolbar">
              <SelectMode
                active={selectMode}
                onClick={e => selectMode ? deselect() : select([])}
              />

              <input
                className="input-slim item-filter"
                type="text"
                onChange={e => setFilter(e.target.value)}
                placeholder="filter by name..."
              />

              <RadioBar
                value={viewMode}
                options={[
                  {value: 'grid', label: <Icon slug="th" alt="Grid"/>},
                  {value: 'list', label: <Icon slug="list" alt="List" />}
                ]}
                onChange={o => setViewMode(o.value)}
              />
            </div>
          </div>
        </div>

        <div className="item-sort">
          {viewMode == 'grid' ? (
            <div className="grid-sort">
              <Select
                value={sortBy}
                options={Deck.publicProps}
                onChange={o => setSort(o.value, sortDesc)}
                clearable={false}
              />
              <RadioBar
                value={sortDesc ? 'DESC' : 'ASC'}
                options={[
                  {value: 'ASC', label: '↑'},
                  {value: 'DESC', label: '↓'}
                ]}
                onChange={o => setSort(sortBy, o.value == 'DESC')}
              />
            </div>
          ) : (
            <div className="item-col-headers">
              {Deck.publicProps.map(prop => {
                let active = prop.value == sortBy;
                return (
                  <div
                    key={prop.value}
                    className={`item-col-header ${Deck.prefix}-${prop.value} ${active ? ' active' : ''}`}
                  >
                    <A onClick={() => setSort(prop.value, active ? !sortDesc : false)} >
                      <div className="item-col-header-inner">{prop.label}</div>
                      {active &&
                        <Icon sm slug={'chevron-'+(sortDesc ? 'down' : 'up')} />}
                    </A>
                  </div>
                )
              })}
            </div>
          )}
        </div>



        <FlexibleItemView
          items={decks}
          itemComponent={Deck}
          filter={filter}
          sortBy={sortBy}
          sortDesc={sortDesc}
          selectedItems={selectedDecks}
          onSelect={select}
          selectMode={selectMode}
          viewMode={viewMode}
        />


        <div className="actions-bar">
          <A onClick={() => beginEdit()}>
            <Icon slug="plus"/>
            <span className="sr-only">Add Deck</span>
          </A>

          <A
            disabled={!selectedDecks.length}
            onClick={this.handleDelete}
            className="delete-item"
          >
            <Icon slug="trash" />
            <span className="sr-only">Delete Deck</span>
          </A>
        </div>

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
    viewMode: state.viewPrefs.mode.decks,
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
    setSort: (by, desc) => dispatch( setSort('decks', by, desc) ),
    setViewMode: (mode) => dispatch( setViewMode('decks', mode) ),
    select: (items, e) => dispatch( select(items) ),
    deselect: () => dispatch( deselect() ),
    beginEdit: (id) => dispatch( beginEdit(id) ),
    cancelEdit: () => dispatch( cancelEdit() ),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecksView);
