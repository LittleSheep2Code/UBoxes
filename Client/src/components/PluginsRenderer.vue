<template>
  <BasicLayoutComponents>
    <div class="full-height full-width" ref="renderer-container" v-html="rendererOptions.pluginHTML"></div>
  </BasicLayoutComponents>
</template>

<script>
import BasicLayoutComponents from "../layouts/BasicLayoutComponents"

export default {
  name: "PluginsRenderer",
  components: {BasicLayoutComponents},
  data: () => ({
    rendererOptions: {
      pluginHTML: ""
    }
  }),

  mounted() {
    this.$store.state.availablePlugins.forEach(plugin => {
      if (plugin.plugin_attributes["package-name"] === this.$route.query["package"]) {
        this.rendererOptions.pluginHTML = plugin.renderer_attributes["indexHTML"]

        this.$nextTick(() => {
          let scripts = document.createElement("script")
          plugin.renderer_attributes["indexHTML"].replace(/<script.*?>([\s\S]+?)<\/script>/img, (_, source) => {
            scripts.innerHTML = source
          });
        })
      }
    })
  }
}
</script>

<style>

</style>
