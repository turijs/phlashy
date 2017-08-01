const POST   = 'POST',
      GET    = 'GET',
      PUT    = 'PUT',
      DELETE = 'DELETE';


const api = {
  login(body) {
    return fetch('/api/login', options(POST, body))
      .catch(catchTimeout);
  },
};

export default api;

function options (method, body) {
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
