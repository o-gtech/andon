<template>
  <div class="semaphore" :class="{ 'semaphore--reversed': reversed }">
    <div class="light light--red" :class="{ 'light--on': color === 'red', 'light--off': color !== 'red' && color !== '' }"></div>
    <div class="light light--yellow" :class="{ 'light--on': color === 'yellow', 'light--off': color !== 'yellow' && color !== '' }"></div>
    <div class="light light--green" :class="{ 'light--on': color === 'green', 'light--off': color !== 'green' && color !== '' }"></div>
    <div class="light light--blue" :class="{ 'light--on': color === 'blue', 'light--off': color !== 'blue' && color !== '' }"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class Semaphore extends Vue {
  @Prop({ default: '' }) readonly color!: string
  @Prop({ default: false }) readonly reversed!: boolean
}
</script>

<style lang="scss" scoped>
.semaphore {
  display: flex;
  flex-direction: row;

  &--reversed {
    flex-direction: row-reverse;
  }
}

.light {
  $size: 1.5rem;
  $padding: $size / 2;

  padding: $padding;
  border-radius: $padding * 2;
  background-color: var(--text-color);
  transition: all ease 0.5s;
  margin-left: 0.1875rem;

  &--red {
    $color: #ad2a2a;
    background-color: $color;

    &.light--on {
      background-color: lighten($color, 10%);
    }

    &.light--off {
      background-color: darken($color, 30%);
    }
  }

  &--yellow {
    $color: #b3b52a;
    background-color: $color;

    &.light--on {
      background-color: lighten($color, 10%);
    }

    &.light--off {
      background-color: darken($color, 30%);
    }
  }

  &--green {
    $color: #2aa832;
    background-color: $color;

    &.light--on {
      background-color: lighten($color, 10%);
    }

    &.light--off {
      background-color: darken($color, 30%);
    }
  }

  &--blue {
    $color: #30429c;
    background-color: $color;

    &.light--on {
      background-color: lighten($color, 10%);
    }

    &.light--off {
      background-color: darken($color, 30%);
    }
  }
}
</style>
