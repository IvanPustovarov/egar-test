import Vue from 'vue'
import Vuex from 'vuex'
const axios = require("axios").default;

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    },
    updateEmployee (state, employee) {
      const findedElemIndex = state.employees.findIndex((elem) => elem.id === employee.id);
      state.employees[findedElemIndex] = employee;
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
    },
    updateEmployee (context, employee) {
      const employeeToPut = {
        name: employee.employee.fullName.name,
        surname: employee.employee.fullName.surname,
        patronymic: employee.employee.fullName.patronymic,
        birthdate: employee.employee.birthdate,
        address: employee.employee.address,
        department: employee.employee.department,
        about: employee.employee.about,
      }
      axios
        .put(`https://629915c87b866a90ec368b06.mockapi.io/api/employee/${employee.employee.id}`, employeeToPut)
        .then((response) => (context.commit('updateEmployee', response.data)));
    }
  },
  modules: {
  }
})
