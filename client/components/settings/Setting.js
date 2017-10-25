import React from 'react';
import {connect} from 'react-redux';

function Setting({title, component: Field, offline}) {
  return (
    <div className="setting">
      <div className="setting-title slim-txt">{title}:</div>
      <Field disabled={offline} />
    </div>
  )
}

export default connect(
  ({offline}) => ({offline})
)(Setting);
