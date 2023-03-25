import { createStore } from "vuex";

export default createStore({
  state: {
    user: null,
    code: null,
    id: null,
  },
  getters: {
    getUser(state) {
      return state.user;
    },

    getCode(state) {
      return state.code;
    },

    getID(state) {
      return state.id;
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
    changeID(state, value) {
      state.id = value;
    },
  },
  actions: {},
  modules: {},
});
