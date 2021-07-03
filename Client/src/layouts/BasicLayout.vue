<template>
  <BasicLayoutComponents><router-view/></BasicLayoutComponents>
</template>

<script>
import BasicLayoutComponents from "./BasicLayoutComponents"

export default {
  name: 'MainLayout',
  components: {BasicLayoutComponents},
}
</script>
