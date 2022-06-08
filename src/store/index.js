import Vue from 'vue'
import Vuex from 'vuex'
const axios = require("axios").default;
const URL = "https://629915c87b866a90ec368b06.mockapi.io/api/employee";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    employees: null,
    isNew: false
  },
  getters: {
  },
  mutations: {
    isCreatingEmployee (state, payload) {
      state.isNew = payload;
    },
    loadEmployees (state, payload) {
      state.employees = payload;
    },
    deleteEmployee(state, id) {
      const findedElemIndex = state.employees.findIndex((elem) => elem.id === id);
      state.employees.splice(findedElemIndex, 1);
    },
    updateEmployee (state, employee) {
      const findedElemIndex = state.employees.findIndex((elem) => elem.id === employee.id);
      state.employees[findedElemIndex] = employee;
    },
    createEmployee (state, employee) {
      state.employees.push(employee);
    }
  },
  actions: {
    loadEmployees({commit}) {
      axios
        .get(`${URL}`)
        .then((response) => (commit('loadEmployees', response.data)));
    },
    deleteEmployee ({commit}, id) {
      axios
        .delete(`${URL}/${id.id}`)
        .then((response) => (commit('deleteEmployee', response.data.id)));
    },
    updateEmployee ({commit}, employee) {
      axios
        .put(`${URL}/${employee.employee.id}`, employee.employee)
        .then((response) => (commit('updateEmployee', response.data)));
    },
    createEmployee (context, employee) {
      axios
      .post(`${URL}`, employee.employee)
      .then(()=> (context.dispatch('loadEmployees')))
      .then(()=> (context.commit('isCreatingEmployee', false)))
    }
  },
  modules: {
  }
})
