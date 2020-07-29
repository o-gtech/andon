<template>
  <div class="control">
    <Button class="control__zoom control__zoom--out p-button-rounded p-button-secondary p-button-text"
      @click="zoomHandler($event, -2)"
    >
      <i class="pi pi-search-minus"></i>
    </Button>
    <span class="control__separator">|</span>
    <Button class="control__zoom control__zoom--in p-button-rounded p-button-secondary p-button-text"
      @click="zoomHandler($event, 2)"
    >
      <i class="pi pi-search-plus"></i>
    </Button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class Zoom extends Vue {
  private _zoom (amount: number) {
    Vue.prototype.$fontSize += amount
    document.documentElement.style.fontSize = Vue.prototype.$fontSize + 'px'
    localStorage.setItem('fontSize', Vue.prototype.$fontSize.toString())
  }

  public zoomHandler (event: any, zoomAmount: number) {
    // If the icon is clicked, target the button to blur
    if (event.target.tagName === 'BUTTON') {
      event.target.blur()
    } else {
      event.path[1].blur()
    }

    this._zoom(zoomAmount)
  }
}
</script>

<style lang="scss" scoped>
.control {
  display: flex;
  align-items: center;

  &__zoom {
    padding: 0.5rem;
    color: var(--text-color) !important;
    transition: all .4s ease;

    &--out:focus {
      transform: scale(.85);
    }

    &--in:focus {
      transform: scale(1.15);
    }

    @media (hover) {
      &--out:hover {
        transform: scale(.85);
      }

      &--in:hover {
        transform: scale(1.15);
      }
    }

    i {
      font-size: 1.25rem;
    }
  }

  &__separator {
    font-size: 1.25rem;
    font-weight: 300;
    margin: 0 0.25rem;
  }
}
</style>
