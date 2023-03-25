import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    code: null,
  },
  getters: {
    getUser(state) {
      return state.user;
    },

    getCode(state) {
      return state.code;
    },
  },
  mutations: {
    login(state, user) {
      state.user = user;
    },
    logout(state) {
      state.user = null;
    },
    changeCode(state, newCode) {
      state.code = newCode;
    },
  },
  actions: {},
  modules: {},
});
