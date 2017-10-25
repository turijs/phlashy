import React from 'react';
import {connect} from 'react-redux';
import SettingField from './SettingField';

import {updateEmail} from '../../actions';

export default connect(
  state => ({
    value: state.user && state.user.email,
    saving: state.settingsMeta.email.waiting,
    error: state.settingsMeta.email.error
  }),
  dispatch => ({
    onSave: (val) => dispatch( updateEmail(val) )
  })
)(SettingField);
