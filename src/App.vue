<template>
  <div id="app">
    <div class="container">
      <Header class="header"></Header>
      <router-view/>

      <Toast class="toast" position="bottom-center" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from './components/Header/Header.vue'

@Component({
  components: {
    Header
  }
})
export default class App extends Vue { }
</script>

<style lang="scss">
@import "@/styles/styles";
</style>
