import React from 'react';
import {connect} from 'react-redux';
import SettingField from './SettingField';

import {updateNickname} from '../../actions';

export default connect(
  state => ({
    value: state.user && state.user.nickname,
    saving: state.settingsMeta.nickname.waiting,
    error: state.settingsMeta.nickname.error
  }),
  dispatch => ({
    onSave: (val) => dispatch( updateNickname(val) )
  })
)(SettingField);
