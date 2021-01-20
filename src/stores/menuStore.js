const menuStore = {
  namespaced: true,
  state: {
    menuRoot: [
      { code: 'Menu1', title: 'Menu1', targetPath: '/menu1' },
      { code: 'message', title: 'Messages', targetPath: '/message' },
    ],
  },
};

export { menuStore };
