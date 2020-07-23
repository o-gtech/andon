<template>
  <div class="control">
    <Button class="control__zoom p-button-rounded p-button-secondary p-button-text p-button-lg"
      icon="pi pi-search-minus"
      @click="zoom(-2)"
    />
    <span class="control__separator">|</span>
    <Button class="control__zoom p-button-rounded p-button-secondary p-button-text p-button-lg"
      icon="pi pi-search-plus"
      @click="zoom(2)"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Zoom extends Vue {
  private fontSize = 18

  mounted () {
    const savedFontSize = localStorage.getItem('fontSize')

    if (savedFontSize) {
      this.fontSize = parseInt(savedFontSize)
    } else {
      localStorage.setItem('fontSize', this.fontSize.toString())
    }

    this._setFontSize(this.fontSize)
  }

  private _setFontSize (fontSize: number) {
    document.documentElement.style.fontSize = fontSize + 'px'
  }

  public zoom (amount: number) {
    this.fontSize += amount
    document.documentElement.style.fontSize = this.fontSize + 'px'
    localStorage.setItem('fontSize', this.fontSize.toString())
  }
}
</script>

<style lang="scss" scoped>
.control {
  display: flex;
  align-items: center;

  &__zoom {
    color: var(--text-color) !important;
  }

  &__separator {
    font-size: 1.25rem;
    font-weight: 300;
    margin: 0 0.25rem;
  }
}
</style>
