<template>
  <q-page>
    <q-tabs v-model="stateTab" inline-label class="bg-blue-10 text-white shadow-2 col-12">
      <q-tab name="general" icon="settings" label="General"/>
      <q-tab name="plugins" icon="extension" label="Plugins"/>
    </q-tabs>

    <q-tab-panels v-model="stateTab" animated class="col-12 full-height">
      <q-tab-panel name="general" class="row justify-center items-center full-height">
        <q-card class="col-md-6 col-xs-8">
          <q-card-section>
            <q-list>
              <q-item-label header class="text-h6">General</q-item-label>
              <q-item :clickable="false">
                <q-item-section side top>
                  <q-checkbox v-model="settings.general.show_package"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Show Plugins Package Name</q-item-label>
                  <q-item-label caption>Enable this, the plugins package name will show in your navigation
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item :clickable="false">
                <q-item-section side top>
                  <q-checkbox v-model="settings.general.enable_plugin_cleaner"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label>Remove plugin data on uninstall</q-item-label>
                  <q-item-label caption>Enable this, the program will remove plugin resource folder
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <q-tab-panel name="plugins" class="row justify-center items-center full-height">
        <q-card class="col-md-6 col-xs-8">
          <q-card-section>
            <q-list dense>
              <q-item-label header class="text-h6">Plugins</q-item-label>
              <q-separator></q-separator>

              <q-item-label header>Installed</q-item-label>
              <q-item v-show="plugins.length === 0">
                <q-item-section class="text-center">
                  <q-icon class="q-mx-auto" name="mdi-toy-brick-remove-outline" size="28px" style="margin-top: 8px"
                          color="negative"></q-icon>
                  <span>No plugin was loaded/installed</span>
                </q-item-section>
              </q-item>

              <q-item v-for="item in plugins" :clickable="false" :key="item.plugin_attributes['package-name']" dense>
                <q-item-section>
                  <q-item-label>
                    {{ item.plugin_attributes['route-title'] }}
                    <span class="text-grey-8">({{ item.plugin_attributes['package-name'] }})</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-btn flat round icon="delete" color="red" @click="deletePlugin(item)" :loading="wait.reload"/>
                </q-item-section>
              </q-item>

              <q-item-label header>Install & Manual Manage</q-item-label>
              <q-item dense>
                <q-item-section>
                  <div>
                    <q-btn flat color="primary" label="Plugins folder" icon-right="folder" @click="openPlugins"/>
                    <q-btn flat color="secondary" label="Install plugin" icon-right="mdi-toy-brick-plus"
                           @click="dialog.install = true"/>
                    <q-btn flat color="negative" label="Reload" icon-right="mdi-reload" @click="reloadPlugins"
                           :loading="wait.reload"/>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-model="dialog.install">
      <q-card style="width: 80%">
        <q-card-section>
          <q-item-label header class="text-h6">Installation</q-item-label>
        </q-card-section>

        <q-card-section class="q-pt-none" style="margin-left: 10px; margin-right: 10px; margin-bottom: 10px">
          <div>
            <q-file label="Select plugin file" v-model="install.file" accept=".u-ext" outlined clearable></q-file>
            <q-btn style="margin-top: 12px" flat color="primary" align="right" icon-right="download"
                   @click="installPlugin" :disable="install.file == null">Install
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {LocalStorage} from "quasar"
import PluginsLoaderSwitcher from "app/plugin-framework/plugin-adder-switcher";
import OpenFolder from "open-file-explorer"

export default {
  name: "Settings",
  data: () => ({
    stateTab: "general",
    wait: {
      reload: false,
      install: false
    },
    dialog: {
      install: false
    },
    install: {
      file: null
    },
    settings: {
      general: {
        show_package: !LocalStorage.getItem("not-show-plugin-package"),
        enable_plugin_cleaner: !!LocalStorage.getItem("save-plugin-data")
      }
    }
  }),

  methods: {
    deletePlugin(plugin_item) {
      this.$q.dialog({
        title: "Warning!",
        message: `You really want remove the plugin with package name ${plugin_item.plugin_attributes['package-name']},
        the plugin files will be delete from file system!
        It doesn't move to trash! After your remove plugin, window will automatic reload.`,
        cancel: false,
      }).onOk(async () => {
        (await PluginsLoaderSwitcher.automaticGetLoaderInstance()).remove_plugin(plugin_item, this.settings.general.enable_plugin_cleaner)
        this.wait.reload = true
        this.$root.$emit("plugins.reload")
        this.$root.$on("plugins.reload.done", () => {
          this.wait.reload = false
        })
      })
    },

    async openPlugins() {
      OpenFolder((await PluginsLoaderSwitcher.automaticGetLoaderInstance()).plugins_instance_folder, null)
    },

    reloadPlugins() {
      this.wait.reload = true
      this.$root.$emit("plugins.reload")
      this.$root.$on("plugins.reload.done", () => {
        this.wait.reload = false
      })
    },

    async installPlugin() {
      (await PluginsLoaderSwitcher.automaticGetLoaderInstance()).install_plugin(this.install.file.path).then(status => {
        if (!status) {
          this.$q.notify({
            message: "Failed to install plugin, there is a problem with the provided file, please check.",
            color: "negative"
          })
        } else {
          this.$q.notify({message: "Installation completed!", color: "positive"})
          this.dialog.install = false
          this.reloadPlugins()
        }
      })
    }
  },

  computed: {
    plugins() {
      return this.$store.state.availablePlugins
    }
  },

  watch: {
    "settings.general.show_package": function (value, old) {
      LocalStorage.set("not-show-plugin-package", value)
      this.$store.commit("updateSettings", this.settings)
    },

    "settings.general.enable_plugin_cleaner": function (value, old) {
      LocalStorage.set("save-plugin-data", value)
      this.$store.commit("updateSettings", this.settings)
    }
  }
}
</script>

<style scoped>

</style>
