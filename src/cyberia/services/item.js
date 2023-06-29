const itemServices = {
  getItem: async (item) => await serviceRequest(API_BASE + `/items/${item.id}`),
  getItemRender: async (itemId) => await serviceRequest(API_BASE + `/items/render/${itemId}`),
};
