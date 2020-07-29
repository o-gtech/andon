<template>
  <div class="actions" >
    <Button class="actions__trigger p-button-rounded p-button-secondary p-button-text"
      @click="toggleActionsMenu($event)"
      aria-haspopup="true"
      aria-controls="actions-menu"
    >
      <i class="pi pi-cog" />
    </Button>

    <OverlayPanel id="actions-menu"
      class="menu actions__menu"
      ref="menu"
      appendTo="body"
      :showCloseIcon="true"
    >
      <div class="menu__section">
        <div class="menu__subtitle">Interfaz</div>
        <div class="menu__items">
          <Zoom />
        </div>
      </div>
      <div class="menu__section">
        <div class="menu__subtitle">Datos del Reporte</div>
        <div class="menu__items">
          <Button class="p-button-info p-button-text"
            @click="dataActionClickHandler('restore', 'Restablecer')"
            :disabled="disableRestore"
          >
            <i class="pi pi-undo" />
            Restablecer
          </Button>
          <Button class="p-button-danger p-button-text"
            @click="dataActionClickHandler('clear', 'Vaciar')"
            :disabled="disableClear"
          >
            <i class="pi pi-trash" />
            Vaciar
          </Button>
        </div>
      </div>
    </OverlayPanel>

    <Dialog class="actions__confirmation"
      header="Confirmación"
      :style="{ margin: '0 1rem' }"
      :visible.sync="actionConfirmationModal"
      :modal="true"
    >
      <div class="actions__confirmation-content">
        <i class="pi pi-exclamation-triangle" />
        <span>{{ confirmationMessage }}</span>
      </div>
      <template #footer>
        <Button label="Cancelar" @click="actionCancelConfirmation()" class="p-button-text p-button-info" autofocus />
        <Button :label="`Si ${actionName}`" @click="actionConfirmation()" class="p-button-text p-button-danger" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'

import { OverlayPanel } from 'primevue/overlaypanel'
import Zoom from '../components/Zoom.vue'

@Component({
  components: {
    Zoom
  }
})
export default class ActionsMenu extends Vue {
  @Prop({ default: false }) readonly disableRestore!: boolean
  @Prop({ default: false }) readonly disableClear!: boolean

  @Ref() readonly menu!: OverlayPanel

  private actionName = ''
  private emitName = ''
  private confirmationMessage = ''
  private actionConfirmationModal = false

  public toggleActionsMenu (event: any) {
    // If the icon is clicked, target the button to blur
    if (event.target.tagName === 'BUTTON') {
      event.target.blur()
    } else {
      event.path[1].blur()
    }

    this.menu.toggle(event)
  }

  public dataActionClickHandler (emitName: string, actionName: string) {
    // Close menu overlaypanel
    this.menu.hide()

    this.emitName = emitName
    this.actionName = actionName.toLowerCase()
    this.confirmationMessage =
      `Estas seguro/a que deseas ${this.actionName}
      el ${this.actionName === 'restablecer' ? 'último' : ''} reporte?`

    this.actionConfirmationModal = true
  }

  public actionCancelConfirmation () {
    this.actionConfirmationModal = false
  }

  public actionConfirmation () {
    this.$emit(this.emitName)

    this.actionConfirmationModal = false
  }
}
</script>

<style lang="scss" scoped>
.actions {
  &__trigger {
    padding: 0.75rem;

    i {
      font-size: 1.25rem;
    }
  }

  &__menu {
    margin-top: -2.75rem;

    &::before,
    &::after {
      content: none;
    }
  }

  &__confirmation {
    &-content {
      display: flex;
      flex-direction: row;
      align-items: center;

      i {
        font-size: 2rem !important;
        margin-right: 0.5rem;
      }
    }
  }
}

.menu {
  &__section {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &__subtitle {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  &__items {
    display: flex;
    flex-direction: column;

    > * {
      margin-bottom: 0.25rem;
    }

    :last-child {
      margin-bottom: 0;
    }

    button:disabled {
      opacity: 0.4 !important;
    }

    i {
      margin-right: 0.25rem;
    }
  }
}
</style>
