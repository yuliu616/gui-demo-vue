const menuStore = {
  namespaced: true,
  state: {
    menuRoot: [
      { code: 'message', title: 'Messages', targetPath: '/message' },
    ],
  },
};

export { menuStore };
