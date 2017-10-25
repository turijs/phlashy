import React from 'react';
import {connect} from 'react-redux';
import withEditingAndSaved from './withEditingAndSaved';
import AsyncButton from '../AsyncButton';
import cn from 'classnames';

function PasswordSetting({
  editing,
  onToggle,
  saving,
  onSave,
  saved,
  error,
  disabled,
}) {
  let oldInput, newInput;
  let oldErr, newErr, genErr;
  if(error) {
    oldErr = error.oldPassword;
    newErr = error.newPassword;
    genErr = (oldErr || newErr) ? '' : error;
  }

  return !editing ? (
    <div className="password-setting">
      <button onClick={onToggle} className="btn-slim">Update Password</button>
      {saved && <span className="saved-msg">Password updated!</span>}
    </div>
  ) : (
    <div className="password-setting editing">
      <input className={cn('input-slim', {error: oldErr})} type="password"
        placeholder="Old password" disabled={saving} ref={node => oldInput = node} />
      {oldErr &&
        <div className="error-msg">{oldErr}</div>}

      <input className={cn('input-slim', {error: newErr})} type="password" 
        placeholder="New password" disabled={saving} ref={node => newInput = node} />
      {newErr &&
        <div className="error-msg">{newErr}</div>}

      <div className="btn-row">
        <button className="btn-slim" onClick={onToggle} disabled={saving}>Cancel</button>

        <AsyncButton className="btn-slim btn-go" loading={saving}
          onClick={() => onSave(oldInput.value, newInput.value)}>Save</AsyncButton>
      </div>

      {genErr &&
        <div className="error-msg">{genErr}</div>}
    </div>
  );
}

import {updatePassword} from '../../actions';

export default connect(
  state => ({
    saving: state.settingsMeta.password.waiting,
    error: state.settingsMeta.password.error
  }),
  dispatch => ({
    onSave: (oldPw, newPw) => dispatch( updatePassword(oldPw, newPw) )
  })
)( withEditingAndSaved(PasswordSetting) );
