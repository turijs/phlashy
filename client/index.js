import React from 'react';
import ReactDOM from 'react-dom';

function Test(props) {
  return <h1>Hello World!</h1>;
}


// =============================
ReactDOM.render(
  <Test />,
  document.getElementById('app')
);
