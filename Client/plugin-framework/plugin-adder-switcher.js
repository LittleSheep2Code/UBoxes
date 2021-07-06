export default class PluginsLoaderSwitcher {

  /**
   * Judge runtime platform and return the available plugin loader
   *
   * @returns {Plugins_Loader}
   */
  static automaticGetLoaderInstance() {
    const mobileAgentList = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ]

    let imported_module;

    mobileAgentList.some((matchItem) => {
      if(navigator.userAgent.match(matchItem)) {
        console.log("[PLUGINS.CROSS-PLATFORM] Using mobile loader")
        imported_module = null
      }

      else {
        console.log("[PLUGINS.CROSS-PLATFORM] Using electron loader")
        imported_module = import("./electron-mode/plugin-adder").then(object => {return object.default})
      }
    })

    return imported_module
  }
}
