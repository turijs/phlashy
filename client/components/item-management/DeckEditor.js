import React from 'react';
import itemEditorWrap from './itemEditorBoilerplate';

function DeckEditor({
  onChange,
  onSubmit,
  onCancel,
  values: {name = '', description = ''}
}) {
  return (
    <div className="deck-editor2">
      <form onSubmit={onSubmit}>
        <input tabIndex="1" autoFocus type="text" name="name" value={name}
          placeholder="Name" onChange={onChange} />
        <textarea tabIndex="2" name="description" defaultValue={description}
          placeholder="Description" onChange={onChange} />
      </form>
      <div className="btn-row">
        <button tabIndex="4" onClick={onCancel}>Cancel</button>
        <button tabIndex="3" className="btn-go" onClick={onSubmit}>Save</button>
      </div>
    </div>
  )
}

export default itemEditorWrap(DeckEditor, {
  initializeDefault: {name: '', description: ''}
});
