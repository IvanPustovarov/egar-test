
import Vue from 'vue'
import Vuex from 'vuex'
const axios = require("axios").default;

// import { INCREMENT } from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0,
    employees: null
  },
  getters: {
  },
  mutations: {
    increment (state, payload) {
      state.count += payload.amount
    },
    decrement (state, payload) {
      state.count -= payload.amount
    },
    updateEmployees (state, payload) {
      state.employees = payload.data;
    }
  },
  actions: {
    // actions -- asynchronyc mutation
    asyncIncrementExampleStore ({commit}, amount) {
      commit('increment', amount)
    },
    decrement ({commit}, amount) {
      commit('decrement', amount)
    },
    // updateEmployees ({commit}, employee) {
    //   commit("updateEmployees", employee)
    // },
    loadEmployees({commit}) {
      axios
        .get("https://629915c87b866a90ec368b06.mockapi.io/api/employee")
        .then((response) => (commit('updateEmployees', response)))
        .catch((error) => console.log(error));
    }
  },
  modules: {
  }
})
