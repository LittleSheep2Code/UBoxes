<template>
  <q-page>
    <iframe :src="rendererOptions.pluginHTML" width="100%" :height="window.height" ref="renderer" frameborder="0"
            id="iframe"/>
  </q-page>
</template>

<script>
import BasicLayoutComponents from "../layouts/BasicLayoutComponents"
import PluginsLoaderSwitcher from "app/plugin-framework/plugin-adder-switcher";

export default {
  name: "PluginsRenderer",
  components: {BasicLayoutComponents},
  data: () => ({
    rendererOptions: {
      pluginHTML: "",
      rendererServer: null
    },

    window: {
      height: window.innerHeight - 58
    }
  }),

  mounted() {
    this.$store.state.availablePlugins.forEach(async plugin => {
      if (plugin.plugin_attributes["package-name"] === this.$route.query["package"]) {
        if (plugin.plugin_attributes["server-require"]) {
          this.$q.loadingBar.start()
          this.$refs["renderer"].onload = () => {
            this.$q.loadingBar.stop()
            this.$forceUpdate()
          }

          this.rendererOptions.rendererServer = (await PluginsLoaderSwitcher.automaticGetLoaderInstance()).starting_renderer_server(plugin.manifest.file_list["resource"])
          if (this.rendererOptions.rendererServer != null) {
            this.$q.loadingBar.increment(50)

            // Wait HTTP Server startup
            setTimeout(() => {
              this.rendererOptions.pluginHTML = "http://127.0.0.1:20123"
            }, 1000)
          } else {
            this.rendererOptions.pluginHTML = "patch_needed.html"
          }

        } else {
          this.rendererOptions.pluginHTML = "file://" + plugin.plugin_attributes["index"]
        }
      }
    })
  },

  beforeDestroy() {
    if (!this.rendererOptions.rendererServer.kill(2))
      this.rendererOptions.rendererServer.kill(9)
  }
}
</script>

<style>

</style>
