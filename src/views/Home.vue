<template>
  <div class="home">
    <div class="home__header">
      <h1 class="home__title">Nuevo Reporte</h1>
      <Zoom />
    </div>
    <div class="selection card">
      <div class="card__title">Datos del reporte</div>
      <div class="card__container selection__50-50">
        <div class="selection__wrapper">
          <div class="selection__title">Planta</div>
          <Dropdown class="dropdown"
            :class="{ 'p-error' : formErrors.plant }"
            v-model="selectedPlant"
            :options="plants"
            optionLabel="name"
            placeholder="Selecciona la planta"
            :filter="plants.length > 6"
            filterPlaceholder="Busca la planta"
          />
          <InlineMessage severity="error" v-show="formErrors.plant">Selecciona una planta</InlineMessage>
        </div>
        <div class="selection__wrapper">
          <div class="selection__title">Máquina</div>
          <Dropdown class="dropdown"
            :class="{ 'p-error' : formErrors.machine }"
            v-model="selectedMachine"
            :options="machines"
            optionLabel="name"
            placeholder="Selecciona la máquina"
            :filter="machines.length > 6"
            filterPlaceholder="Busca la máquina"
            :disabled="!showMachines"
          />
          <InlineMessage severity="error" v-show="formErrors.machine">Selecciona una máquina</InlineMessage>
        </div>
      </div>

      <div class="card__container selection__30-70">
        <div class="selection__wrapper">
          <div class="selection__title">Categoría</div>
          <Listbox class="listbox"
            :class="{ 'p-error' : formErrors.category }"
            v-model="selectedCategory"
            :options="categories"
            optionLabel="name"
            listStyle="max-height: 8rem"
            :filter="categories.length > 6"
            filterPlaceholder="Busca la categoría"
          >
            <template #option="slotProps">
              <div class="listbox__item">
                <span class="listbox__item-badge p-badge"
                  :class="'p-badge-' + getSeverityStatus(slotProps.option.severity)"
                >
                  {{slotProps.option.severity}}
                </span>
                <span class="listbox__item-name">{{slotProps.option.name}}</span>
              </div>
            </template>
          </Listbox>
          <InlineMessage severity="error" v-show="formErrors.category">Selecciona una categoría</InlineMessage>
        </div>
        <div class="comment">
          <span class="comment__wrapper p-float-label">
            <Textarea id="comment"
              ref="comment"
              v-model="comment"
              rows="2"
              :autoResize="true"
              @focus="showCommentTemplates = true"
            />
            <label for="comment">Comentarios</label>
          </span>
          <div class="comment__templates" :class="{ 'comment__templates--visible': showCommentTemplates }">
            <Button class="p-button-secondary p-button-rounded"
              v-for="(value, index) in commentTemplates"
              :key="index"
              :label="value.comment + (value.edit ? '...' : '')"
              @click="setComment(value.comment, value.edit)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="area card">
      <div class="card__title">Mandar a area</div>
      <div class="card__container">
        <Button class="area__button"
          v-for="(value, key, index) in areas"
          :key="index"
          :label="value"
          @click="areaButtonClickHandler($event, key)"
        >
          {{ value }}
          <i class="pi pi-arrow-up"></i>
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import MessageService from '../services/MessageService'

import Zoom from '../components/Zoom.vue'

interface Record {
  readonly name: string;
}

const emptyRecord: Record = {
  name: ''
}

interface CategoryRecord {
  readonly name: string;
  readonly severity: number;
}

const emptyCategoryRecord: CategoryRecord = {
  name: '',
  severity: 0
}

@Component({
  components: {
    Zoom
  }
})
export default class Home extends Vue {
  private selectedPlant = emptyRecord
  private selectedMachine = emptyRecord
  private selectedCategory = emptyCategoryRecord
  private showMachines = false
  private plants: Record[] = []
  private machines: Record[] = []
  private categories: CategoryRecord[] = []
  private comment = ''
  private showCommentTemplates = false
  private commentTemplates = [
    { comment: 'Mantenimiento preventivo a operación', edit: false },
    { comment: 'Falta de ', edit: true },
    { comment: 'Cambio de ', edit: true },
    { comment: 'Inspección 100%', edit: false }
    // { comment: 'Mtto. Preventivo A Operacion' edit: false }, // Mantenimiento
    // { comment: 'Mtto. Correctivo A Operacion' edit: false }, // Mantenimiento
    // { comment: 'Mtto. Preventivo A Herramental' edit: false }, // Mantenimiento
    // { comment: 'Mtto. Correctivo A Herramental' edit: false }, // Mantenimiento
    // { comment: 'Falta De Material Por Falla Operacion Anterior' edit: false }, // Mantenimiento
    // { comment: 'Bloqueada Por Falla De Operacion Siguiente' edit: false }, // Mantenimiento
    // { comment: 'Falta De Herramientas' edit: false }, // Herramientas
    // { comment: 'Cambio De Herramientas' edit: false }, // Herramientas
    // { comment: 'Ajuste Falla De Herramientas' edit: false }, // Herramientas
    // { comment: 'Falta De Material' edit: false }, // MTLS
    // { comment: 'Pruebas De Ingenieria' edit: false }, // Ingenieria
    // { comment: 'Velocidad Reducida' edit: false }, // Ingenieria
    // { comment: 'Retrabajo / Contenciones' edit: false }, // Calidad
    // { comment: 'Inspeccion 100%' edit: false }, // Calidad
    // { comment: 'Calibres' edit: false }, // Calidad
    // { comment: 'Metrologia' edit: false }, // Calidad
    // { comment: 'Cambio De Modelo', edit: false }, // Produccion
    // { comment: 'Juntas', edit: false }, // Produccion
    // { comment: 'Limpieza' edit: false }, // Produccion
    // { comment: 'Causa Especial De Produccion' edit: false }, // Produccion
    // { comment: 'Servicio Medico', edit: false }, // RH
    // { comment: 'Capacitacion', edit: false } // RH
  ]

  private phone = '+5218181757838'
  private areas = {
    hse: 'HSE',
    operations: 'Operaciones',
    tooling: 'Herramentales',
    maintenance: 'Mantenimiento',
    quality: 'Calidad'
  }

  private formErrors = {
    plant: false,
    machine: false,
    category: false
  }

  get plant (): string {
    return this.selectedPlant.name
  }

  get machine (): string {
    return this.selectedMachine.name
  }

  get category (): string {
    return this.selectedCategory.name
  }

  mounted () {
    this.plants = this.getPlants()
    this.categories = this.getCategories()
  }

  @Watch('selectedPlant')
  public fetchMachines () {
    this.showMachines = false // Wait until we receive data from server
    // TODO: Get the plant's machines from server
    this.machines = this.getMachines(this.plant)
    this.showMachines = true
    this.formErrors.plant = false
  }

  @Watch('selectedMachine')
  public machineSelected () {
    this.formErrors.machine = false
  }

  @Watch('selectedCategory')
  public activateCommentTemplates () {
    if (!this.comment) {
      this.focusCommentInput()
      this.showCommentTemplates = true
    }
    this.formErrors.category = false
  }

  public focusCommentInput () {
    ((this.$refs.comment as Vue).$el as HTMLElement).focus() // https://forum.vuejs.org/t/vetur-bug-or-code-error-property-el-does-not-exist-on-type-svgelement/73696
  }

  public getPlants (): Record[] {
    const plants = [
      { name: 'Alameda' },
      { name: 'Calabazas' },
      { name: 'Murrieta' }
    ]
    return plants
  }

  public getMachines (plant: string): Record[] {
    switch (plant) {
      case 'Calabazas':
        return [
          { name: '10' },
          { name: '11' },
          { name: '12' }
        ]
      default:
        return [
          { name: '90' },
          { name: '91' },
          { name: '92' }
        ]
    }
  }

  public getCategories (): CategoryRecord[] {
    const categories = [
      { name: 'Mantenimiento', severity: 5 },
      { name: 'Fallo', severity: 9 },
      { name: 'Ajustes', severity: 2 },
      { name: 'Falta', severity: 5 }
    ]
    return categories.sort((a, b): number => (
      a.severity < b.severity) ? 1 : (a.severity === b.severity) ? ((a.name > b.name) ? 1 : -1) : -1
    )
  }

  public getSeverityStatus (severity: number): string {
    if (severity < 4) {
      return 'info'
    }

    if (severity > 4 && severity < 8) {
      return 'warning'
    }

    return 'danger'
  }

  public setComment (text: string, edit: boolean): void {
    this.comment = text
    if (edit) {
      this.focusCommentInput()
    }
    this.showCommentTemplates = false
  }

  private _validateForm (): boolean {
    this.formErrors = {
      plant: this.plant === '',
      machine: this.machine === '',
      category: this.category === ''
    }

    const errors = Object.values(this.formErrors)

    for (const error of errors) {
      if (error) {
        return false
      }
    }

    return true
  }

  private _animateSendButton (button: HTMLElement, sent: boolean) {
    const animationClass = 'area__button--' + (sent ? 'sent' : 'error')

    button.classList.add(animationClass)
    button.blur()

    // Remove after animation ends to be able to trigger it again
    setTimeout(() => {
      button.classList.remove(animationClass)
    }, 4000)
  }

  private _sendText (area: string): boolean {
    const data = {
      plant: this.plant,
      machine: this.machine,
      area: area,
      comment: this.comment,
      phone: this.phone
    }
    let sentText = false

    MessageService.send(data)
      .then((response: any) => {
        this.$toast.add({ severity: 'success', summary: 'Mensaje mandado!', detail: response.data, life: 3000 })
        // TODO: Block send multiple times a message
        sentText = true
      })
      .catch((error: any) => {
        const errorMessage = error.response ? error.response.data : 'No se pudo conectar con el servidor.'
        this.$toast.add({ severity: 'error', summary: errorMessage, detail: 'Porfavor intentelo de nuevo', life: 3000 })
        sentText = false
      })

    return sentText
  }

  public areaButtonClickHandler (event: any, area: string) {
    let button = event.target
    // When the icon inside the button is clicked target the button
    if (button.tagName !== 'BUTTON') {
      button = event.path[1]
    }

    if (!this._validateForm()) {
      this._animateSendButton(button, false)
      return
    }

    const sentText = this._sendText(area)
    this._animateSendButton(button, sentText)
  }
}
</script>

<style lang="scss" scoped>
@mixin gap-between-items($gap: 1rem, $children: "*") {
  margin: -#{$gap} 0 0 -#{$gap};
  width: calc(100% + #{$gap});

  @each $child in $children {
    > #{$child} {
      margin: $gap 0 0 $gap;
    }
  }
}

.home {
  > .card {
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 2rem;
    }
  }

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
  }

  &__title {
    font-size: 2rem;
  }
}

.card {
  background-color: var(--surface-e);
  padding: 2rem;
  border-radius: 6px;
  box-shadow: 0 0 12px -2px rgba(0, 0, 0, .1);

  &__title {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  &__container {
    display: flex;
    flex-flow: row wrap;

    &:last-of-type {
      margin-bottom: 0;
    }
  }
}

.selection {
  $gap: 1rem;
  $label-size: 1rem;

  display: flex;
  flex-direction: column;

  .card__container {
    @include gap-between-items($gap);
  }

  &__50-50 {
    margin-bottom: 2rem !important;

    > * {
      $width: calc(50% - #{$gap});
      flex: 1 0 $width;
    }
  }

  &__30-70 {
    align-items: flex-start;

    > :first-child {
      $width: calc(30% - #{$gap});
      flex: 1 0 $width;
    }

    > :last-child {
      $width: calc(70% - #{$gap} * 3);
      flex: 1 0 $width;
    }
  }

  &__wrapper {
    .selection__title {
      font-size: $label-size;
      margin: 0 0 .25rem .5rem;
    }

    .p-error {
      border-color: #f44336;
    }

    .p-inline-message {
      width: 100%;
    }

    .dropdown {
      width: 100%;
    }

    .listbox {
      &__item {
        display: block;
        white-space: nowrap;

        &-badge {
          margin-right: 0.5rem;
        }

        &-name {
          vertical-align: middle;
        }
      }
    }
  }

  .comment {
    display: flex;
    flex-flow: column wrap;
    margin-top: 2.5rem;

    &__wrapper {
      textarea {
        width: 100%;
      }

      label::after {
        font-size: .75rem;
        margin-left: .25rem;
        color: var(--text-color-secondary);
        content: "(opcional)";
      }

      input:focus ~ label,
      input.p-filled ~ label,
      textarea:focus ~ label,
      textarea.p-filled ~ label,
      .p-inputwrapper-focus ~ label,
      .p-inputwrapper-filled ~ label {
        font-size: $label-size !important;
        color: var(--text-color) !important;
      }
    }

    &__templates {
      @include gap-between-items(1rem, button);

      opacity: 0;
      overflow: hidden;
      height: 0;
      display: flex;
      flex-wrap: wrap;
      padding: .5rem .25rem;
      transition: opacity .5s, height .5s;

      &--visible {
        opacity: 1;
        height: 100%;
      }
    }
  }
}

.area {
  .card__container {
    @include gap-between-items(1.25rem, button);
  }

  &__button {
    display: flex;
    flex-grow: 1;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 1.15rem;
    transition: all .2s ease;
    box-shadow:
      0 4px 6px rgba(0, 0, 0, .1),
      0 1px 3px rgba(0, 0, 0, .08);

    @mixin icon-transformation() {
      i {
        transform: rotate(45deg) translateY(-3px);
      }
    }

    &:focus {
      @include icon-transformation;
    }

    @media (hover) {
      &:hover {
        @include icon-transformation;

        box-shadow:
          0 7px 14px rgba(0, 0, 0, .1),
          0 3px 6px rgba(0, 0, 0, .08);
      }
    }

    i {
      transition: transform .3s ease;
      margin-left: .25rem;
      transform: rotate(45deg);
    }

    @keyframes sent {
      15% {
        transform: rotate(45deg) translateY(-1rem);
        opacity: 0;
      }
      75% {
        transform: rotate(45deg) translateY(-3px);
        opacity: 0;
      }
      100% {
        transform: rotate(45deg) translateY(0);
        opacity: 1;
      }
    }

    @keyframes send-error {
      50% {
        transform: rotate(45deg) translate(50%, 50%);
        opacity: 0;
      }
      75% {
        transform: rotate(45deg) translate(0);
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    &--sent {
      i {
        animation: sent 4s;
      }
    }

    &--error {
      i {
        animation: send-error 4s;
      }
    }
  }
}
</style>
