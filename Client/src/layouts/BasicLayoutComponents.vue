<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu"
               @click="navigationData.isDrawerOpen = !navigationData.isDrawerOpen"/>
        <q-toolbar-title>UBoxes</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="navigationData.isDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-list>
        <q-item-label header class="text-grey-8">
          Available application
        </q-item-label>
        <NavigationItems v-for="item in navigationItems" :key="item.title" v-bind="item"
                         :show_package="navigationData.packageShow"/>
      </q-list>
    </q-drawer>

    <q-page-container class="full-height">
      <slot/>
    </q-page-container>
  </q-layout>
</template>

<script>
import {LocalStorage} from "quasar"
import NavigationItems from "components/NavigationItems"

let navigationItemsList = [
  {
    title: "Settings",
    package_name: "Main(Bundle)",
    icon: "settings",
    route: "/settings"
  },

  {
    title: "Main",
    package_name: "Main(Bundle)",
    icon: "mdi-code-tags",
    route: "/main"
  }
];

export default {
  name: "MainLayout",
  components: {NavigationItems},

  data: () => ({
    navigationData: {
      isDrawerOpen: false,

      packageShow: !LocalStorage.getItem("not-show-plugin-package")
    }
  }),

  watch: {
    "$store.state.settings": function() {
      this.navigationData.packageShow = this.$store.state.settings.general.show_package
    }
  },

  computed: {
    navigationItems() {
      return navigationItemsList.concat(this.$store.state.navigationItems)
    }
  }
}
</script>
