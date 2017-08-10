const api = {
  post(path, body) {
    return fetch('/api' + path, options('POST', body))
      .catch(catchTimeout);
  },

  get(path) {
    return fetch('/api' + path, {method: 'GET', credentials: 'same-origin'})
      .catch(catchTimeout);
  },

  put(path, body) {
    return fetch('/api' + path, options('PUT', body))
      .catch(catchTimeout);
  },

  delete(path, body) {
    return fetch('/api' + path, options('DELETE', body))
      .catch(catchTimeout);
  }
};

export default api;

function options (method, body = {}) {
  return {
    method,
    headers: new Headers({"Content-Type": "application/json"}),
    credentials: 'same-origin',
    body: JSON.stringify(body)
  };
}

function catchTimeout(e) {
  return {timeout: true}
}
