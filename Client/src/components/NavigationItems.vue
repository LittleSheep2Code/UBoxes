<template>
  <q-item clickable :to="route">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon"/>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption v-show="show_package">{{ package_name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "NavigationItems",
  props: {
    title: {
      type: String,
      required: true
    },

    package_name: {
      type: String,
      default: ""
    },

    route: {
      type: String,
      default: ""
    },

    icon: {
      type: String,
      default: ""
    },

    show_package: {
      type: Boolean,
      default: true
    }
  }
}
</script>
