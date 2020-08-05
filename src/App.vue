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
import { Vue, Component } from 'vue-property-decorator'
import Header from './components/Header/Header.vue'
import 'vue-apollo' // https://github.com/vuejs/vue-apollo/issues/473#issuecomment-509361897

@Component({
  components: {
    Header
  }
})
export default class App extends Vue {
  created () {
    Vue.prototype.$fontSize = 18
  }

  mounted () {
    this._setupZoom()
  }

  private _setupZoom () {
    const savedFontSize = localStorage.getItem('fontSize')

    if (savedFontSize) {
      Vue.prototype.$fontSize = parseInt(savedFontSize)
    } else {
      localStorage.setItem('fontSize', Vue.prototype.$fontSize.toString())
    }

    document.documentElement.style.fontSize = Vue.prototype.$fontSize + 'px'
  }
}
</script>

<style lang="scss">
@import "@/styles/styles";
</style>
