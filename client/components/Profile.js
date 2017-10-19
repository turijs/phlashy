import React from 'react';
import {LoggedOutOnly} from './auth-conditional';
import {Redirect} from 'react-router-dom';
import ProfileField from './profile/ProfileField';

const Profile = () => (
  <div id="profile" className="container-med">
    <h1>Profile</h1>
    <ProfileField value="turi" />

    <LoggedOutOnly><Redirect to="/login" /></LoggedOutOnly>
  </div>
);

export default Profile;
