import React from 'react';
import {LoggedOutOnly} from './auth-conditional';
import {Redirect} from 'react-router-dom';
import SettingField from './settings/SettingField';
import NicknameSetting from './settings/NicknameSetting';

const Settings = () => (
  <div id="settings" className="container-med">
    <h1>Account Settings</h1>
    <SettingField value="turi" />
    <NicknameSetting />

    <LoggedOutOnly><Redirect to="/login" /></LoggedOutOnly>
  </div>
);

export default Settings;
