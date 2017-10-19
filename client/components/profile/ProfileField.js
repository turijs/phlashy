import React from 'react';
import A from '../A';
import Icon from '../Icon';

class ProfileField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
  }

  toggleEditing = () => this.setState({editing: !this.state.editing});

  render() {
    let {value, onUpdate} = this.props;

    if(!this.state.editing) return (
      <span className="profile-field">
        <span className="slim-txt">{value}</span> <A onClick={this.toggleEditing}><Icon slug="pencil"/></A>
      </span>
    ); else return (
      <span className="profile-field editing">
        <input className="input-slim" defaultValue={value}/>
        <button className="btn-slim" onClick={this.toggleEditing}>Cancel</button>
        <button className="btn-slim btn-go">Save</button>
      </span>
    );

  }
}

export default ProfileField;
