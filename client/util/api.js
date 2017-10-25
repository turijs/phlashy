const api = {
  post(path, body) {
    return request('/api' + path, options('POST', body))
  },

  get(path) {
    return request('/api' + path, options('GET'))
  },

  put(path, body) {
    return request('/api' + path, options('PUT', body))
  },

  delete(path, body) {
    return request('/api' + path, options('DELETE'))
  },

  head(path) {
    return request('/api' + path, options('HEAD'))
  }
};

export default api;


export function toJSON(res) {
  return res.json();
}

export function HTTPError(status, msg, res = null) {
  this.status = status;
  this.message = msg;
  this.res = res;
}

/*=== Helper functions ===*/

function request(...args) {
  return fetch(...args).catch(transformFailure).then(rejectErrors);
}

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

function rejectErrors(res) {
  if(!res.ok)
    throw new HTTPError(res.status, res.statusText, res);
  return res;
}

function transformFailure() {
  throw new HTTPError(0, 'FETCH_FAILED');
}
