import React from 'react';
import itemEditorWrap from './itemEditorBoilerplate'

function CardEditor({
  onChange,
  onSubmit,
  onCancel,
  values: {front = '', back = ''}
}) {
  return (
    <div className="card-editor">
      <form onSubmit={onSubmit}>
        <textarea tabIndex="1" autoFocus name="front" value={front}
          placeholder="Front" onChange={onChange} />
        <textarea tabIndex="2" name="back" value={back}
          placeholder="Back" onChange={onChange} />
      </form>
      <div className="btn-row">
        <button tabIndex="4" onClick={onCancel}>Cancel</button>
        <button tabIndex="3" className="btn-go" onClick={onSubmit}>Save</button>
      </div>
    </div>
  )
}

export default itemEditorWrap(CardEditor);
