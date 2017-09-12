const api = {
  post(path, body) {
    return fetch('/api' + path, options('POST', body))
      .catch(transformFailure);
  },

  get(path) {
    return fetch('/api' + path, {method: 'GET', credentials: 'same-origin'})
      .catch(transformFailure);
  },

  put(path, body) {
    return fetch('/api' + path, options('PUT', body))
      .catch(transformFailure);
  },

  delete(path, body) {
    return fetch('/api' + path, options('DELETE', body))
      .catch(transformFailure);
  },

  head(path) {
    return fetch('/api' + path, {method: 'HEAD'})
      .catch(transformFailure);
  }
};

export default api;

export function rejectErrors(res) {
  if(res.status == 401)
    throw 'LOGGED_OUT';
  else if(res.status >= 500)
    throw 'SERVER_ERROR';

  return res;
}

export function toJSON(res) {
  return rejectErrors(res).json();
}

function options (method, body = {}) {
  return {
    method,
    headers: new Headers({"Content-Type": "application/json"}),
    credentials: 'same-origin',
    body: JSON.stringify(body)
  };
}

function transformFailure() {
  throw 'FETCH_FAILED';
}
