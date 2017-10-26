import React from 'react';

function withEditingAndSaved(Wrapped) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {editing: false, saveAttempted: false}
    }

    componentWillReceiveProps({saving, error}) {
      if(!saving && !error)
        this.stopEdit();
    }

    startEdit = () => this.setState({editing: true, saveAttempted: false});

    stopEdit = () => this.setState({editing: false});

    handleSave = (...args) => {
      this.setState({saveAttempted: true});
      this.props.onSave(...args)
    }

    render() {
      let {props, state, startEdit, stopEdit, handleSave} = this;
      let saved = state.saveAttempted && !props.saving && !props.error;
      let error = state.saveAttempted && props.error;

      return <Wrapped
        {...props}
        error={error}
        editing={state.editing}
        onEdit={startEdit}
        onSave={handleSave}
        onCancel={stopEdit}
        saved={saved}
      />
    }
  }
}

export default withEditingAndSaved;
