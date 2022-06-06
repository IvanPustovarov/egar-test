import Vue from 'vue'
import Vuex from 'vuex'
const axios = require("axios").default;

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    employees: null
  },
  getters: {
  },
  mutations: {
    updateEmployees (state, payload) {
      state.employees = payload.data;
    },
    deleteEmployee(state, id) {
      const findedElemIndex = state.employees.findIndex((elem) => elem.id === id);
      state.employees.splice(findedElemIndex, 1);
    }
  },
  actions: {
    loadEmployees({commit}) {
      axios
        .get("https://629915c87b866a90ec368b06.mockapi.io/api/employee")
        .then((response) => (commit('updateEmployees', response)))
        .catch((error) => console.log(error));
    },
    deleteEmployee ({commit}, id) {
      axios
        .delete(`https://629915c87b866a90ec368b06.mockapi.io/api/employee/${id.id}`)
        .then((response) => (commit('deleteEmployee', response.data.id)));
    }
  },
  modules: {
  }
})
