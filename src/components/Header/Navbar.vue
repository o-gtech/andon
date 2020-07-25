<template>
  <nav class="navbar">
    <div class="navbar__logo">
      <span class="logo"></span>
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

    .logo {
      $width: 1.5rem;
      $padding: $width / 2;

      padding: $padding;
      border-radius: $padding * 2;
      background-color: var(--text-color);
    }
  }

  &__title {
    position: absolute;
    font-size: 1.5rem;
    font-weight: 500;
  }
}
</style>
