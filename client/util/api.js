const api = {
  post(path, body) {
    return fetch('/api' + path, options('POST', body))
      .catch(transformFailure)
      .then(rejectErrors);

  },

  get(path) {
    return fetch('/api' + path, options('GET'))
      .catch(transformFailure)
      .then(rejectErrors);

  },

  put(path, body) {
    return fetch('/api' + path, options('PUT', body))
      .catch(transformFailure)
      .then(rejectErrors);

  },

  delete(path, body) {
    return fetch('/api' + path, options('DELETE'))
      .catch(transformFailure)
      .then(rejectErrors);

  },

  head(path) {
    return fetch('/api' + path, options('HEAD'))
      .catch(transformFailure)
      .then(rejectErrors);

  }
};

export default api;

export function rejectErrors(res) {
  if(!res.ok)
    throw res;
  return res;
}

export function toJSON(res) {
  return res.json();
}

/*=== Helper functions ===*/

function options (method, body) {
  return body ? {
    method,
    headers: new Headers({'Content-Type': 'application/json'}),
    credentials: 'same-origin',
    body: JSON.stringify(body)
  } : {
    method,
    credentials: 'same-origin'
  };
}

function transformFailure() {
  throw {
    ok: false,
    status: 0,
    statusText: 'FETCH_FAILED'
  }
}
