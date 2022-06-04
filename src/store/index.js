import Vue from 'vue'
import Vuex from 'vuex'

// import { INCREMENT } from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  getters: {
  },
  mutations: {
    increment (state, payload) {
      state.count += payload.amount
    },
    decrement (state, payload) {
      state.count -= payload.amount
    }
  },
  actions: {
    // actions -- asynchronyc mutation
    asyncIncrementExampleStore ({commit}, amount) {
      commit('increment', amount)
    },
    decrement ({commit}, amount) {
      commit('decrement', amount)
    }
  },
  modules: {
  }
})
