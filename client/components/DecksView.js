import React from 'react';
import { connect } from 'react-redux';
import FlexibleItemView from './FlexibleItemView';
import Modal from './Modal';
import { addDeckTemp, deleteDeck } from '../actions';

function Deck({id, name, onClick, selected}) {
  let selClass = selected ? 'selected' : '';
  return (
    <div className={`deck ${selClass}`} onClick={onClick}>
      id: {id} | name: <b>{name}</b>
    </div>
  )
}
Deck.filterableProps = ['name'];



class NewDeckModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {name: '', description: ''};
  }

  handleChange(e) {
    let {name, value} = e.target;
    this.setState({[name]: value});
  }

  handleSubmit(e) {
    e.preventDefault();
    let {name, description} = this.state;
    this.props.onAdd({name, description});
    // reset form
    this.setState({name: '', description: ''})
  }

  render() {
    let {onCancel, onSubmit, ...rest} = this.props;
    let {name, description} = this.state;
    return (
      <Modal onClickOutside={onCancel} {...rest}>
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
    this.handleAdd = this.handleAdd.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
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

  handleAdd(deckData) {
    this.props.addDeck(deckData);
    this.toggleModal();
  }

  handleDelete() {
    for(let id in this.state.selectedItems)
      this.props.deleteDeck(id);
  }

  handleItemClick(itemID, e) {
    if(e.metaKey || e.ctrlKey) {

    }
    let sel = this.state.selectedItems;
    this.setState({
      selectedItems: {...sel, [itemID]: !sel[itemID]}
    });
  }

  render() {
    let {newDeck, filter, sort, selectedItems} = this.state;
    return (
      <div id="decks">
        <h1>Decks</h1>

        <input
          type="text"
          onChange={e => this.setState({filter: e.target.value})}
          placeholder="filter by name"
        /> &nbsp;

        Sort:
        <select value={sort} onChange={e => this.setState({sort: e.target.value})}>
          <option value="id">ID</option>
          <option value="name">Name</option>
        </select>

        <FlexibleItemView
          items={this.props.decks}
          itemComponent={Deck}
          filter={filter}
          sort={sort}
          onItemClick={this.handleItemClick}
          selectedItems={selectedItems}
        />

        <button className="btn-stop" disabled={!Object.values(selectedItems).includes(true)} onClick={this.handleDelete}>Delete</button>
        <button onClick={this.toggleModal}>Add</button>

        <NewDeckModal show={newDeck} onCancel={this.toggleModal} onAdd={this.handleAdd}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let decks = [];
  for(let id in state.decks) {
    decks.push({id, ...state.decks[id]});
  }
  return {decks};
}

function mapDispatchToProps(dispatch) {
  return {
    addDeck: (deckData) => dispatch( addDeckTemp(deckData) ),
    deleteDeck: (id) => dispatch( deleteDeck(id) )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DecksView);
