import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function () {
  return new Vuex.Store({
    state: {
      settings: {},
      navigationItems: [],
      availablePlugins: []
    },

    mutations: {
      updateSettings(state, value) {
        state.settings = JSON.parse(JSON.stringify(value))
      },

      installNavigationItems(state, value) {
        state.navigationItems.push(value)
      },

      updateNavigationItems(state, values) {
        state.navigationItems = values
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
