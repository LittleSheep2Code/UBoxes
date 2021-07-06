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
              <q-item v-for="item in plugins" :clickable="false" :key="item.plugin_attributes['package-name']" dense>
                <q-item-section>
                  <q-item-label>
                    {{ item.plugin_attributes['package-name'] }}
                    <span class="text-grey-8">({{ item.plugin_attributes['index'] }})</span>
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
                    <q-btn flat color="secondary" label="Install plugin" icon-right="mdi-toy-brick-plus"/>
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
  </q-page>
</template>

<script>
import {Cookies} from "quasar"
import PluginsLoaderSwitcher from "app/plugin-framework/plugin-adder-switcher";
import OpenFolder from "open-file-explorer"

export default {
  name: "Settings",
  data: () => ({
    stateTab: "general",
    wait: {
      reload: false
    },
    settings: {
      general: {
        show_package: !Cookies.get("not-show-plugin-package")
      }
    }
  }),

  methods: {
    deletePlugin(plugin_item) {
      this.$q.dialog({
        title: "Warning!",
        text: `You really want remove the plugin with package name ${plugin_item.plugin_attributes['package-name']},
        the plugin files will be delete from file system!
        It doesn't move to trash! After your remove plugin, window will automatic reload.`,
        cancel: false,
      }).onOk(async () => {
        (await PluginsLoaderSwitcher.automaticGetLoaderInstance()).remove_plugin(plugin_item)
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
    }
  },

  computed: {
    plugins() {
      return this.$store.state.availablePlugins
    }
  },

  watch: {
    "settings.general.show_package": function (value, old) {
      this.$store.commit("updateSettings", this.settings)
      Cookies.set("not-show-plugin-package", value)
    }
  }
}
</script>

<style scoped>

</style>
