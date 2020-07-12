<template>
  <div id="app">
    <Header class="header" title="Sistema ANDON"></Header>
    <router-view/>

    <Toast />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Header from './components/Header.vue'

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
