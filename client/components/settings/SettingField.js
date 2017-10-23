import React from 'react';
import A from '../A';
import Icon from '../Icon';
import withEditingAndSaved from './withEditingAndSaved';
import AsyncButton from '../AsyncButton';

function SettingField({
  value,
  editing,
  onToggle,
  saving,
  onSave,
  saved,
  error
}) {
  let input;

  return !editing ? (
    <span className="profile-field">
      <span className="slim-txt">{value}</span>
      <A onClick={onToggle}><Icon slug="pencil"/></A>
      {saved && <span className="saved-msg">Saved!</span>}
    </span>
  ) : (
    <span className="profile-field editing">
      <input className="input-slim" defaultValue={value}
        disabled={saving} ref={node => input = node} />
      <button className="btn-slim" onClick={onToggle} disabled={saving}>Cancel</button>
      <AsyncButton className="btn-slim btn-go" onClick={() => onSave(input.value)}
        loading={saving}>Save</AsyncButton>
      {error &&
        <div className="setting-error">{error}</div>}
    </span>
  );

}

export default withEditingAndSaved(SettingField);
