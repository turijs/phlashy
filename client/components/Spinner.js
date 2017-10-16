import React from 'react';
import spinnerImage from '../images/spinner.png';

const Spinner = ({size}) => (
  <span className="spinner">
    <img width={size} height={size} src={spinnerImage} alt="loading"/>
  </span>
);

Spinner.defaultProps = {
  size: 32
}

export default Spinner;
