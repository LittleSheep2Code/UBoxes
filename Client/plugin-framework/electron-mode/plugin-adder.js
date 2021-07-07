import {existsSync, readdir, readdirSync, readFileSync, stat, statSync} from "fs"
import {mkdirsSync, readJsonSync, removeSync} from "fs-extra"
import AdmZip from "adm-zip"
import ChildProcess from "child_process"

import path from "path"
import electron, {remote} from "electron"
import {Notify} from "quasar";

import Plugin from "../interfaces/plugin-instance"
import PluginManifest from "../interfaces/plugin-manifest-instance";

export default class Plugins_Loader {
  static plugins_instance_folder
  static renderer_server_folder

  static plugins_manifests = {}
  static plugins = []

  /**
   * Load every plugins from "${appData}/UBoxes/plugins/instances" folder
   *
   * @returns {Promise<>}
   */
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

              let plugin_manifest = new PluginManifest(readJsonSync(file_path), file_path)
              plugin_manifest.content.index = path.join(Plugins_Loader.plugins_instance_folder, plugin_manifest.content.index)
              plugin_manifest.file_list.resource = path.join(Plugins_Loader.plugins_instance_folder, plugin_manifest.content.resource)

              Plugins_Loader.plugins_manifests[plugin_name] = plugin_manifest
              Plugins_Loader.register_plugin(Plugins_Loader.plugins_manifests[plugin_name])
            }
          })
        }
      })
    })
  }

  /**
   * Register plugin to memory
   *
   * @param plugin_manifest Need register plugin manifest instance(Not content)
   */
  static register_plugin(plugin_manifest) {
    let plugin_instance = new Plugin(plugin_manifest)

    // Check package name is duplicate
    let can_registered;
    Plugins_Loader.plugins.forEach(plugin => {
      if (plugin.plugin_attributes["package-name"] === plugin_instance.plugin_attributes["package-name"]) {
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
    let template_file_uri = plugin_instance.plugin_attributes.index

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

  /**
   * Uninstall plugin function
   * This function need execute after loaded plugins
   *
   * @param plugin_instance Need uninstall plugin instance
   * @param clean If is true, remove resource folder
   */
  static remove_plugin(plugin_instance, clean) {
    if (plugin_instance.manifest.file_list.manifest != null)
      removeSync(plugin_instance.manifest.file_list.manifest)

    if (plugin_instance.manifest.file_list.resource != null && clean)
      removeSync(plugin_instance.manifest.file_list.resource)
  }

  /**
   * Install plugin file function
   *
   * @param plugin_file Need install plugin file, require ends with ".u-ext"
   * @param overwrite Overwrite installed plugin file
   * @returns {Promise<Boolean>}
   */
  static install_plugin(plugin_file, overwrite) {
    return new Promise(resolve => {
      // Promise the plugin folder is OK
      Plugins_Loader.plugins_instance_folder = path.join((electron.app || electron.remote.app).getPath("appData"), "UBoxes/plugins/instances")

      // Check file is OK
      if (!existsSync(plugin_file) || !plugin_file.endsWith(".u-ext")) {
        resolve(false)
        return
      }

      // Get zip files
      let zip_file = new AdmZip(plugin_file, {})
      let zip_files = zip_file.getEntries();

      // Write files to plugin folder
      zip_file.extractAllTo(Plugins_Loader.plugins_instance_folder, overwrite, null);
      resolve(true)
    })
  }

  /**
   * Start server for require server renderer plugin
   *
   * @param resource Http Server working folder
   * @returns {null, ChildProcessWithoutNullStreams}
   */
  static starting_renderer_server(resource) {
    Plugins_Loader.renderer_server_folder = path.join((electron.app || electron.remote.app).getPath("appData"), "UBoxes/renderer-server")
    let wrapper = path.join((electron.app || electron.remote.app).getPath("appData"), "UBoxes/renderer-server/bin/http-server")

    if (!existsSync(Plugins_Loader.renderer_server_folder) || !existsSync(wrapper) || readdirSync(this.renderer_server_folder).length === 0) {
      remote.dialog.showErrorBox(
        "Please install renderer server patch!",
        "This plugin need server renderer path! Please download the renderer server path installer on github."
      )

      mkdirsSync(Plugins_Loader.renderer_server_folder)

      return null
    }

    let origin_working = process.cwd()

    process.chdir(resource)
    let child = ChildProcess.spawn(wrapper, ["-p", "20123"])
    process.chdir(origin_working)

    child.stdout.on("data", message => {
      console.log("[RENDERER-PATCH] Renderer Server message: " + message)
    })

    child.stderr.on("data", error => {
      console.log("[RENDERER-PATCH] Renderer Server message: " + error)
    })

    child.on("exit", (code, single) => {
      console.log("[RENDERER-PATCH] Renderer Server with exit single: " + single + `(${code})`)

      if (code !== 0)
        Notify.create({
          message: `Renderer Server with exit code ${code}`,
          color: "warning"
        })
    })

    return child
  }
}
