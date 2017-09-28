import React from 'react';
import Modal from '../Modal';

class CardEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = this.getNewState(props);
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    if(nextProps.card != this.props.card)
      this.setState( this.getNewState(nextProps) );
  }

  getNewState({card}) {
    if(!card)
      return {front: '', back: ''}

    return {front: card.front, back: card.back};
  }

  handleChange(e) {
    let {name, value} = e.target;
    this.setState({[name]: value});
  }

  handleSubmit(e) {
    e.preventDefault();
    let {front, back} = this.state;
    this.props.onSave({front, back});
  }

  render() {
    let {card, onCancel, onSave, ...rest} = this.props;
    let {front, back} = this.state;

    return (
      <Modal onClickOutside={onCancel} className="card-editor" {...rest}>
        <form onSubmit={this.handleSubmit} onChange={this.handleChange}>
          <textarea name="front" defaultValue={front} placeholder="Front" />
          <textarea name="back" defaultValue={back} placeholder="Back" />
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
