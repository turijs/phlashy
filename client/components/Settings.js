import React from 'react';
import {connect} from 'react-redux';
import {LoggedOutOnly, OfflineOnly} from './app-conditional';
import {Redirect} from 'react-router-dom';
import Setting from './settings/Setting';
import NicknameField from './settings/NicknameSettingField';
import EmailField from './settings/EmailSettingField';
import PasswordField from './settings/PasswordSettingField';

const Settings = () => (
  <div id="settings" className="container-med">
    <h1>Account Settings</h1>
    
    <OfflineOnly className="caution-box">
      Account settings cannot be modified while offline
    </OfflineOnly>

    <Setting title="Nickname" component={NicknameField} />
    <Setting title="Email" component={EmailField} />
    <Setting title="Password" component={PasswordField} />

    <LoggedOutOnly><Redirect to="/login" /></LoggedOutOnly>
  </div>
);

export default Settings;
