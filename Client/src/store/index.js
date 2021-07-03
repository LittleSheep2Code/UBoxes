import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function () {
  return new Vuex.Store({
    state: {
      navigationItems: [],
      availablePlugins: []
    },

    mutations: {
      installNavigationItems(state, value) {
        state.navigationItems.push(value)
      },

      updateNavigationItems(state, values) {
        state.navigationItems.concat(values)
      },

      installPlugin(state, plugin) {
        state.availablePlugins.push(plugin)
      },

      updateAvailablePlugins(state, plugins) {
        state.availablePlugins = plugins
      }
    },

    strict: process.env.DEBUGGING
  })
}
