import React from 'react';
import {connect} from 'react-redux';
import {OfflineOnly} from './app-conditional';
import A from './A';
import Modal from './Modal';

class OfflineIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {more: false}
  }

  onLess = () => this.setState({more: false});

  render() {
    return (
      <OfflineOnly id="offline-indicator">
        <b>Connection lost.</b> Changes will be saved locally. {' '}
        <A onClick={() => this.setState({more: true})}>Learn more.</A>

        <Modal show={this.state.more} onClickOutside={this.onLess} >
          <h2>Offline Info</h2>
          <p>While offline, you can continue using Phlashy as usual. The changes you make will be temporarily saved to your device. Once you regain connection, as long as you are still logged in, those changes will be automatically synced to your account.</p>
          <button className="right" onClick={this.onLess}>Got it</button>
        </Modal>
      </OfflineOnly>)
  }
}

export default OfflineIndicator;
