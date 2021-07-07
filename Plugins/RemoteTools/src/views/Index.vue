<template>
  <v-container fill-height fluid class="row">
    <div class="col-12 text-center">
      <div>
        <h3>Remote Tools</h3>
        <span>Connect every server/computer with openSSH</span>
      </div>

      <v-btn @click="$dialog.notify.info('Button is ok')">CHECK</v-btn>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Main"
}
</script>

<style scoped>

</style>
