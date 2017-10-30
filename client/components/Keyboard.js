import React from 'react';
import kbs from '../util/keyboard_shortcuts';

class Keyboard extends React.Component {
  componentDidMount() {
    this.bindShortcuts(this.props);
  }

  componentWillUnmount() {
    this.unbindShortcuts(this.props);
  }

  bindShortcuts({shortcuts, newScope}) {
    if(newScope) kbs.newScope();
    for(let keys in shortcuts)
      kbs(keys, shortcuts[keys])
  }

  unbindShortcuts({shortcuts, newScope}) {
    if(newScope) kbs.restore();
    else for(let keys in shortcuts)
      kbs.unbind(keys);
  }

  render() { return null; }
}

export default Keyboard;
