const authServices = {
  registerUser: async (body) => {
    body = JSON.stringify(body);
    const headers = {
      // 'Authorization': renderAuthBearer(),
      'Content-Type': 'application/json',
      // 'content-type': 'application/octet-stream'
      //  'content-length': CHUNK.length,
    };
    return await serviceRequest(API_BASE + '/auth/register', {
      method: 'POST',
      headers,
      body,
      log: true,
    });
  },
  logIn: async (body) => {
    body = JSON.stringify(body);
    const headers = {
      // 'Authorization': renderAuthBearer(),
      'Content-Type': 'application/json',
      // 'content-type': 'application/octet-stream'
      //  'content-length': CHUNK.length,
    };
    return await serviceRequest(API_BASE + '/auth/login', {
      method: 'POST',
      headers,
      body,
      log: true,
    });
  },
  sendConfirmEmail: async () => {
    const body = JSON.stringify({});
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('_b')}`,
      'Content-Type': 'application/json',
      // 'content-type': 'application/octet-stream'
      //  'content-length': CHUNK.length,
    };
    return await serviceRequest(API_BASE + '/auth/confirm/email', {
      method: 'POST',
      headers,
      body,
      log: true,
    });
  },
  getUserRender: async () =>
    await serviceRequest(API_BASE + '/user-render', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('_b')}`,
        //  'Content-Type': 'application/json',
      },
    }),
  validateEmail: async (email) => await serviceRequest(API_BASE + '/auth/validate/email/' + email),
  validateUsername: async (username) => await serviceRequest(API_BASE + '/auth/validate/username/' + username),
};
