import React from 'react';

function withEditingAndSaved(Wrapped) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {editing: false, saveAttempted: false}
    }

    componentWillReceiveProps({saving, error}) {
      if(!saving && !error)
        this.toggleEditing();
    }

    toggleEditing = () => {
      this.setState(({editing, saveAttempted}) => ({
        editing: !editing,
        saveAttempted: editing ? saveAttempted : false
      }));
    }

    handleSave = (...args) => {
      this.setState({saveAttempted: true});
      this.props.onSave(...args)
    }

    render() {
      let {props, state, toggleEditing, handleSave} = this;
      let saved = state.saveAttempted && !props.saving && !props.error;
      let error = state.saveAttempted && props.error;

      return <Wrapped
        {...props}
        error={error}
        editing={state.editing}
        onToggle={toggleEditing}
        onSave={handleSave}
        saved={saved}
      />
    }
  }
}

export default withEditingAndSaved;
