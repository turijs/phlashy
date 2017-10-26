import React from 'react';
import A from '../A';
import Icon from '../Icon';
import withEditingAndSaved from './withEditingAndSaved';
import AsyncButton from '../AsyncButton';
import cn from 'classnames';

function SettingField({
  value,
  editing,
  onEdit,
  onCancel,
  saving,
  onSave,
  saved,
  error,
  disabled,
}) {
  let input;

  return !editing ? (
    <div className="setting-field">
      <span className="slim-txt">{value}</span>
      <A onClick={onEdit} disabled={disabled}><Icon slug="pencil"/></A>
      {saved && <span className="saved-msg">Saved!</span>}
    </div>
  ) : (
    <div className="setting-field editing">
      <input className={cn('input-slim', {error})} defaultValue={value}
        disabled={saving} ref={node => input = node} />
      <div className="btn-row">
        <button className="btn-slim" onClick={onCancel} disabled={saving}>Cancel</button>
        <AsyncButton className="btn-slim btn-go" onClick={() => onSave(input.value)}
          loading={saving}>Save</AsyncButton>
      </div>

      {error &&
        <div className="error-msg">{error}</div>}
    </div>
  );

}

export default withEditingAndSaved(SettingField);
