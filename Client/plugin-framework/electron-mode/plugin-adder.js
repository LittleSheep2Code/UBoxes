import {existsSync, readdir, stat, statSync, readFileSync} from "fs"
import {mkdirsSync, readJsonSync} from "fs-extra"

import path from "path"
import electron, {remote, app} from "electron"

import Plugin from "../interfaces/plugin-instance"

export default class Plugins_Loader {
  static plugins_instance_folder

  static plugins_manifests = {}
  static plugins = []

  static load_plugins() {
    return new Promise(resolve => {
      // Clean the data first
      Plugins_Loader.plugins = []
      Plugins_Loader.plugins_manifests = {}
      Plugins_Loader.plugins_instance_folder = ""

      // Promise the plugin folder is exist
      Plugins_Loader.plugins_instance_folder = path.join((electron.app || electron.remote.app).getPath("appData"), "UBoxes/plugins/instances")
      if (!existsSync(Plugins_Loader.plugins_instance_folder)) {
        console.log("[PLUGINS] Creating plugins folder: " + Plugins_Loader.plugins_instance_folder)
        mkdirsSync(Plugins_Loader.plugins_instance_folder)
      }

      // Scan plugin folder
      readdir(Plugins_Loader.plugins_instance_folder, (err, files) => {
        // Promise process checker
        let done_amount = 0

        for (let id = 0; id <= files.length; id++) {
          // Check all plugin is installed
          if (id === files.length) {
            console.log("[PLUGINS] All plugin was loaded(In Promise)")
            resolve(Plugins_Loader.plugins)
            break
          }

          // Process plugin files
          let file_path = path.join(Plugins_Loader.plugins_instance_folder, files[id])
          let file_uri = files[id]

          stat(file_path, (err, file) => {
            if (file.isFile() && path.basename(file_uri).endsWith(".manifest.json")) {
              console.log(`[PLUGINS] Now Loading plugins... ${file_path}(${id})`)

              let file_name = path.basename(file_uri)
              let plugin_name = file_name.substr(0, file_name.length - 14)
              Plugins_Loader.plugins_manifests[plugin_name] = readJsonSync(file_path)

              Plugins_Loader.register_plugin(Plugins_Loader.plugins_manifests[plugin_name])
            }
          })
        }
      })
    })
  }

  static register_plugin(plugin_manifest) {
    let plugin_instance = new Plugin(plugin_manifest)

    // Check package name is duplicate
    let can_registered;
    Plugins_Loader.plugins.forEach(plugin => {
      if(plugin.plugin_attributes["package-name"] === plugin_instance.plugin_attributes["package-name"]) {
        console.log("[PLUGINS] Failed register plugin: " + plugin_instance.plugin_attributes.index)
        remote.dialog.showErrorBox(
          "Failed to register plugins",
          `The package name of "${plugin.plugin_attributes["package-name"]}" is duplicate with the plugin currently being loaded`
        )
        can_registered = false
      }
    })

    // Default checker
    can_registered = plugin_instance.check_plugin_attributes()

    if (!can_registered) {
      // Show wrong dialog
      console.log("[PLUGINS] Failed register plugin: " + plugin_instance.plugin_attributes.index)
      remote.dialog.showErrorBox(
        "Failed to loading plugins",
        `Cannot load plugin: wrong manifest attributes`
      )
      return
    }

    // Template checker
    let template_file_uri = path.join(
      Plugins_Loader.plugins_instance_folder,
      plugin_instance.plugin_attributes.index
    )

    console.log("[PLUGINS] Check template can render for " + template_file_uri)
    if (!existsSync(template_file_uri) || !statSync(template_file_uri).isFile()) {
      // Show wrong dialog
      console.log("[PLUGINS] Failed register plugin: " + plugin_instance.plugin_attributes.index)
      remote.dialog.showErrorBox(
        "Failed to loading plugins",
        `Cannot load plugin: cannot found index template`
      )
      return
    }

    // Render template
    plugin_instance.renderer_attributes.indexHTML = readFileSync(template_file_uri, "utf-8")

    // Push plugins
    Plugins_Loader.plugins.push(plugin_instance)
    console.log("[PLUGINS] Success register plugin: " + plugin_instance.plugin_attributes.index)
  }
}
