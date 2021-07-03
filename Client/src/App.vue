<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>
<script>
import PluginsLoaderSwitcher from "../plugin-framework/plugin-adder-switcher"

export default {
  name: "App",

  async mounted() {
    (await PluginsLoaderSwitcher.automaticGetLoaderInstance()).load_plugins().then(plugins => {
      this.$store.commit("updateAvailablePlugins", [])
      this.$store.commit("updateNavigationItems", [])

      setTimeout(() => {
        for (let plugin of plugins) {
          console.log("[PLUGINS.SHOW] RENDERER PLUGIN: " + plugin.plugin_attributes["package-name"])

          this.$store.commit("installPlugin", plugin)
          this.$store.commit("installNavigationItems", {
            title: plugin.plugin_attributes["route-title"],
            package_name: plugin.plugin_attributes["package-name"],
            icon: plugin.plugin_attributes["route-icon"],
            route: "/plugins?package=" + plugin.plugin_attributes["package-name"]
          })
        }
      }, 200)
    })
  }
}
</script>
