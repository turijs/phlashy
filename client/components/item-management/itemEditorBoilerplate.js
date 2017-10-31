import React from 'react';
import Modal from '../Modal';

export default function itemEditorWrap(Editor, options = {}) {
  const {
    initializeDefault = {}
  } = options;

  class EditorWrap extends React.Component  {
    constructor(props) {
      super(props);
      this.state = props.initializeFrom || initializeDefault;
    }

    componentWillReceiveProps({initializeFrom}) {
      this.setState( initializeFrom || initializeDefault );
    }

    handleChange = e => {
      let {name, value} = e.target;
      this.setState({[name]: value});
    }

    handleSubmit = e => {
      e.preventDefault();
      this.props.onSave(this.state);
      this.props.onClose();
      // this.setState(this.props.initializeFrom);
    }

    render() {
      let {show, onClose, onSave, initializeFrom, ...rest} = this.props;
      let {name, description} = this.state;

      return (
        <Modal onClose={onClose} className="item-editor" show={show}>
          <Editor
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            onCancel={onClose}
            values={this.state}
            {...rest}
          />
        </Modal>
      )
    }
  }

  return EditorWrap
}
