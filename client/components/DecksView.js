import React from 'react';
import FlexibleItemView from './FlexibleItemView';
import Modal from './Modal';

function Deck({id, name}) {
  return (
    <div className="deck">
      id: {id} | name: {name}
    </div>
  )
}

let decksList = [
  {id: 1, name: "Hello there"},
  {id: 5, name: "Italian"}
];

class NewDeckModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {name: '', desc: ''};
  }

  handleChange(e) {
    let {name, value} = e.target;
    this.setState({[name]: value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit();
  }

  render() {
    let {onCancel, onSubmit, ...rest} = this.props;
    let {name, desc} = this.state;
    return (
      <Modal onClickOutside={onCancel} {...rest}>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="name" value={name} />
          <textarea name="desc" value={desc} />

        </form>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={this.handleSubmit}>Save</button>
      </Modal>
    );
  }
}

class DecksView extends React.Component {
  constructor(props) {
    super(props);
    this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      newDeck: false
    }
  }

  toggleModal() {
    this.setState({newDeck: !this.state.newDeck});
  }

  render() {
    let {newDeck} = this.state;
    return (
      <div id="decks">
        <h1>Decks</h1>
        <FlexibleItemView items={decksList} itemComponent={Deck} />
        <button onClick={this.toggleModal}>Add</button>
        <NewDeckModal show={newDeck} onCancel={this.toggleModal}/>
      </div>
    );
  }
}

export default DecksView;
