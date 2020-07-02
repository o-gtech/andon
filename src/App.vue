<template>
  <div id="app">
    <m-theme>
    <!-- <div class="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
      <router-view/>
    </m-theme>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

// @ts-ignore
import Theme from 'material-components-vue/dist/theme'

Vue.use(Theme)

export default { }
</script>

<style lang="scss">
@import "@/styles/styles";
</style>
