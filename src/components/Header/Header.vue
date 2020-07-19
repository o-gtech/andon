<template>
  <header class="header">
    <Navbar class="header--navbar" />
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Navbar from './Navbar.vue'

@Component({
  components: {
    Navbar
  }
})
export default class Header extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  display: flex;
  flex-direction: column;
}
</style>
