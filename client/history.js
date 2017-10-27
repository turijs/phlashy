import {
  createBrowserHistory as createHistory,
  locationsAreEqual, createLocation
} from 'history';

const history = createHistory();

// monkey patch history.push so repeated link clicks will replace
const push = history.push;
history.push = (path, state) => {
  let location = createLocation(path, state, history.location.key, history.location);

  if( locationsAreEqual(location, history.location) )
    history.replace(path, state);
  else
    push(path, state)
}

export default history;
