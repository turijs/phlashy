import React from 'react';
import Modal from '../Modal';

class DeckEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = this.getNewState(props);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.deck != this.props.deck)
      this.setState( this.getNewState(nextProps) );
  }

  getNewState({deck}) {
    if(!deck)
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
      <Modal onClickOutside={onCancel} className="deck-editor" {...rest}>
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <input type="text" name="name" defaultValue={name} placeholder="Name" />
          <textarea name="description" defaultValue={description} placeholder="Description" />
        </form>
        <div className="btn-row">
          <button onClick={onCancel}>Cancel</button>
          <button className="btn-go" onClick={this.handleSubmit}>Save</button>
        </div>
      </Modal>
    );
  }
}

export default DeckEditor;
