<template>
  <header class="header">
    <div class="header--logo">
      <!-- TODO: Insert logo -->
      Logo
    </div>
    <div class="header--title">
      <h1>{{ title }}</h1>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  @Prop() private title!: string
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  display: flex;
  flex-direction: row;

  &--logo {
    flex-grow: 1;
  }

  &--title {
    flex-grow: 2;
  }
}
</style>
