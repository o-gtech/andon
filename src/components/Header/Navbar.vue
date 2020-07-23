<template>
  <nav class="navbar">
    <div class="navbar__logo">
      <i class="pi pi-circle-on" style="fontSize: 1.5rem"></i>
    </div>
    <div class="navbar__title">
      Andon
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Navbar extends Vue {}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;

  &__logo {
    display: flex;
    align-items: center;
    margin-right: auto;
  }

  &__title {
    position: absolute;
    font-size: 1.3rem;
  }
}
</style>
