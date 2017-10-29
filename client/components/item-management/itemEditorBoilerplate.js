import React from 'react';
import Modal from '../Modal';

export default function itemEditorWrap(Editor) {
  class EditorWrap extends React.Component  {
    constructor(props) {
      super(props);
      this.state = props.initializeFrom;
    }

    componentWillReceiveProps(nextProps) {
      this.setState( nextProps.initializeFrom );
    }

    handleChange = e => {
      let {name, value} = e.target;
      this.setState({[name]: value});
    }

    handleSubmit = e => {
      e.preventDefault();
      this.props.onSave(this.state);
      this.setState({});
    }

    render() {
      let {show, onCancel, onSave, initializeFrom, ...rest} = this.props;
      let {name, description} = this.state;

      return (
        <Modal onClose={onCancel} className="item-editor" show={show}>
          <Editor
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            onCancel={onCancel}
            values={this.state}
            {...rest}
          />
        </Modal>
      )
    }
  }

  EditorWrap.defaultProps = {
    initializeFrom: {}
  }

  return EditorWrap
}
