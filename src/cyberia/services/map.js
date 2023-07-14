const mapServices = {
  getMap: async (mapName) =>
    await serviceRequest(API_BASE + '/maps/' + mapName, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('_b')}`,
        //  'Content-Type': 'application/json',
      },
    }),
  upload: async (body) =>
    await serviceRequest(API_BASE + '/maps/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('_b')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      log: true,
    }),
  getMapDataEngine: async (name_map) =>
    await serviceRequest(API_BASE + '/maps/engine/' + name_map, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('_b')}`,
        //  'Content-Type': 'application/json',
      },
      log: true,
    }),
};
