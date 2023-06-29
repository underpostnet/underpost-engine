const mapServices = {
  getMap: async (mapName) =>
    await serviceRequest(API_BASE + '/maps/' + mapName, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('_b')}`,
        //  'Content-Type': 'application/json',
      },
    }),
};
