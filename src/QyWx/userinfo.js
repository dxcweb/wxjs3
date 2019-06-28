let userinfo = {
  isLogin: false,
};
export default {
  get: () => {
    return userinfo;
  },
  set: (data) => {
    userinfo = { ...userinfo, ...data };
  },
};
