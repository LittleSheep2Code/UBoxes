export default class Plugin {

  static REQUIRE_KEYS = ["index", "package-name", "route-name", "route-title", "route-icon"]

  // Plugin settings attributes
  plugin_attributes = {
    "index": null,
    "package-name": null,

    "route-name": null,
    "route-title": null,
    "route-icon": null
  }

  // Renderer attributes
  renderer_attributes = {
    "indexHTML": ""
  }

  constructor(plugin_manifest) {
    this.plugin_attributes = plugin_manifest
  }

  check_plugin_attributes() {

    let status = true

    Plugin.REQUIRE_KEYS.forEach(require_key => {
      if(Object.keys(this.plugin_attributes).indexOf(require_key) === -1) {
        status = false
      }
    })

    return status
  }
}
