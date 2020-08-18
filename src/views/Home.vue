<template>
  <div class="home">
    <div class="home__header">
      <h1 class="home__title">Nuevo Reporte</h1>
      <ActionsMenu
        :disableRestore="!lastSentReport"
        v-on:restore="restoreReport()"
        :disableClear="!selectedPlant && !selectedMachine && !selectedCategory && !comment"
        v-on:clear="clearReport()"
      />
    </div>
    <div v-if="$apollo.queries.plants.loading">Loading...</div>
    <div class="selection card">
      <div class="card__title">Datos del reporte</div>
      <div class="card__container selection__50-50">
        <div class="selection__wrapper">
          <div class="selection__title">Planta</div>
          <Dropdown class="dropdown"
            :class="{ 'p-error' : showErrors && formErrors.plant }"
            v-model="selectedPlant"
            :options="plants"
            optionLabel="name"
            placeholder="Selecciona la planta"
            :filter="plants && plants.length > 6"
            filterPlaceholder="Busca la planta"
            :disabled="!plants"
          />
          <InlineMessage severity="error" v-show="showErrors && formErrors.plant">Selecciona una planta</InlineMessage>
        </div>
        <div class="selection__wrapper">
          <div class="selection__title">Máquina</div>
          <Dropdown class="dropdown"
            :class="{ 'p-error' : showErrors && formErrors.machine}"
            v-model="selectedMachine"
            :options="machines"
            optionLabel="name"
            placeholder="Selecciona la máquina"
            :filter="machines && machines.length > 6"
            filterPlaceholder="Busca la máquina"
            :disabled="!machines"
          />
          <InlineMessage severity="error" v-show="showErrors && formErrors.machine">Selecciona una máquina</InlineMessage>
        </div>
      </div>

      <div class="card__container selection__30-70">
        <div class="selection__wrapper">
          <div class="selection__title">Categoría</div>
          <Listbox class="listbox"
            :class="{ 'p-error' : showErrors && formErrors.category }"
            v-model="selectedCategory"
            :options="categories"
            optionLabel="name"
            listStyle="max-height: 8rem"
            :filter="categories && categories.length > 6"
            filterPlaceholder="Busca la categoría"
            :disabled="!categories"
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
          <InlineMessage severity="error" v-show="showErrors && formErrors.category">Selecciona una categoría</InlineMessage>
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

    <!-- TODO: Hide area with opacity to animate it -->
    <div class="area card" v-show="!!areas">
      <div class="card__title">Mandar a area</div>
      <div class="card__container">
        <Button class="area__button"
          v-for="area in areas"
          :key="area.id"
          @click="areaButtonClickHandler($event, area)"
          :disabled="disableSendButtons"
        >
          {{ area.name }}
          <i class="pi pi-arrow-up"></i>
        </Button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Ref } from 'vue-property-decorator'
import gql from 'graphql-tag'
import { DateTime } from 'luxon'

import { Plant, Machine, Area, Category, Report } from '../typings'
import MessageService from '../services/MessageService'
import ActionsMenu from '../components/ActionsMenu.vue'

const NULL = null as any

const allPlantsQuery = gql`query getPlants {
  getPlants {
    id
    name
    areas {
      id
      name
      phones
    }
    machines {
      id
      name
      areas
    }
  }
}`

const createReportMutation = gql`mutation CreateReport(
  $creationDate: DateTime!,
  $assistDate: DateTime,
  $solvedDate: DateTime,
  $categoryID: String!,
  $plantID: ID!,
  $areaID: ID!,
  $machineID: ID!,
  $comment: String!
) {
  createReport(
    creation_date: $creationDate,
    assist_date: $assistDate,
    solved_date: $solvedDate,
    category: $categoryID,
    plant: $plantID,
    area: $areaID,
    machine: $machineID,
    comment: $comment
  ) {
    id
  }
}`

@Component({
  components: {
    ActionsMenu
  },
  apollo: {
    plants: {
      query: allPlantsQuery,
      update: data => data.getPlants
      // pollInterval: 300 ???
    }
  }
})
export default class Home extends Vue {
  // Plants
  private selectedPlant: Plant = NULL
  private plants: Plant[] = NULL
  // Machines
  private selectedMachine: Machine = NULL
  private machines: Machine[] = NULL
  // Category
  private selectedCategory: Category = NULL
  private categories: Category[] = NULL
  // Area
  private areas: Area[] = NULL
  // Comment
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

  private lastSentReport: Report = NULL
  private disableSendButtons = true
  private showErrors = false

  private formErrors = {
    plant: true,
    machine: true,
    category: true
  }

  get hasErrors (): boolean {
    const errors = Object.values(this.formErrors)

    for (const error of errors) {
      if (error) {
        return true
      }
    }

    return false
  }

  mounted () {
    // TODO: Get categories from API
    this.categories = this.getCategories()
  }

  @Ref('comment') readonly commentTextArea!: Vue

  @Watch('selectedPlant')
  public plantSelected () {
    if (this.selectedPlant) {
      this.machines = this.selectedPlant.machines
      this.areas = this.selectedPlant.areas
      this.selectedMachine = NULL
      this.formErrors.plant = false
    } else {
      this.formErrors.plant = true
    }

    this._checkSendButtons()
  }

  @Watch('selectedMachine')
  public machineSelected () {
    if (this.selectedMachine) {
      this.formErrors.machine = false
    } else {
      this.formErrors.machine = true
    }

    this._checkSendButtons()
  }

  @Watch('selectedCategory')
  public categorySelected () {
    if (this.selectedCategory) {
      if (!this.comment) {
        this.showCommentTemplates = true
      }
      this.formErrors.category = false
    } else {
      this.formErrors.category = true
    }

    this._checkSendButtons()
  }

  private _checkSendButtons () {
    if (this.hasErrors) {
      this.disableSendButtons = true
    } else {
      this.disableSendButtons = false
    }
  }

  public getCategories (): Category[] {
    const categories: Category[] = [
      { id: '0', name: 'Mantenimiento', severity: '5' },
      { id: '1', name: 'Fallo', severity: '9' },
      { id: '2', name: 'Ajustes', severity: '2' },
      { id: '3', name: 'Falta', severity: '5' }
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
      const commentTextArea = this.commentTextArea.$el as HTMLTextAreaElement
      commentTextArea.focus()
    }
    this.showCommentTemplates = false
  }

  public restoreReport () {
    if (this.lastSentReport) {
      this.selectedPlant = this.lastSentReport.plant
      this.selectedMachine = this.lastSentReport.machine
      this.selectedCategory = this.lastSentReport.category
      this.comment = this.lastSentReport.comment
    }
  }

  public clearReport () {
    this.disableSendButtons = true
    this._clearInputs()
  }

  private _validateForm () {
    this.formErrors = {
      plant: !this.selectedPlant,
      machine: !this.selectedMachine,
      category: !this.selectedCategory
    }

    this.showErrors = this.hasErrors
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
    const message = `Máquina ${this.selectedMachine.name} de la planta ${this.selectedPlant.name} [${this.selectedCategory.name}]\n` +
                    `Area ${area} notificada` + this.comment ? ` por ${this.comment}` : ''
    let messageSent = false

    // TODO: Send the area as argument to be able to identify to whom we are sending the message
    MessageService.send(message)
      .then((response: any) => {
        this.$toast.add({ severity: 'success', summary: 'Mensaje enviado!', detail: response.data, life: 3000 })
        messageSent = true
      })
      .catch((error: any) => {
        const errorMessage = error.response ? error.response.data : 'No se pudo conectar con el servidor'
        this.$toast.add({ severity: 'error', summary: errorMessage, detail: 'Porfavor intentelo de nuevo', life: 3000 })
        messageSent = false
      })

    return messageSent
  }

  private _clearInputs () {
    this.selectedPlant = NULL
    this.selectedMachine = NULL
    this.selectedCategory = NULL
    this.comment = ''

    this.machines = NULL
    this.areas = NULL
  }

  private _saveReport (): Promise<boolean> {
    return new Promise(resolve => {
      this.$apollo.mutate({
        mutation: createReportMutation,
        variables: {
          creationDate: this.lastSentReport.creation_date,
          assistDate: this.lastSentReport.assist_date,
          solvedDate: this.lastSentReport.solved_date,
          plantID: this.lastSentReport.plant.id,
          machineID: this.lastSentReport.machine.id,
          categoryID: this.lastSentReport.category.id,
          areaID: this.lastSentReport.area.id,
          comment: this.lastSentReport.comment
        },
        // update: (store: any, { data: { createReport } }: any) => {
        //   const data = store.readQuery({ query: allReportsQuery })
        //   data.allReports.push(createReport)
        //   store.writeQuery({ query: allReportsQuery, data })
        // },
        optimisticResponse: {
          __typename: 'Mutation',
          createReport: {
            __typename: 'Report',
            id: -1,
            creation_date: this.lastSentReport.creation_date,
            assist_date: this.lastSentReport.assist_date,
            solved_date: this.lastSentReport.solved_date,
            plant: this.lastSentReport.plant.id,
            machine: this.lastSentReport.machine.id,
            category: this.lastSentReport.category.id,
            area: this.lastSentReport.area.id,
            comment: this.lastSentReport.comment
          }
        }
      }).then(({ data }: any) => {
        this.lastSentReport.id = data.createReport.id
        console.log(data)
        resolve(true)
      }).catch((error) => {
        console.log(error)
        resolve(false)
      })
    })
  }

  public async areaButtonClickHandler (event: any, area: Area) {
    let button = event.target
    // When the icon inside the button is clicked target the button
    if (button.tagName !== 'BUTTON') {
      button = event.path[1]
    }

    this._validateForm()

    if (this.hasErrors) {
      this._animateSendButton(button, false)
      this.disableSendButtons = true
      return
    }

    this.lastSentReport = {
      creation_date: DateTime.local(),
      assist_date: NULL,
      solved_date: NULL,
      plant: this.selectedPlant,
      machine: this.selectedMachine,
      category: this.selectedCategory,
      area: area,
      comment: this.comment
    }

    const reportSent = this._sendText(area.name)
    const reportSaved = await this._saveReport()

    this.lastSentReport.sent = reportSent
    this.lastSentReport.saved = reportSaved

    this._animateSendButton(button, reportSent)

    if (reportSent) {
      this.showErrors = false
      this._clearInputs()
      this.selectedPlant = this.lastSentReport.plant
      await this.$nextTick()
      this.disableSendButtons = true
    } else {
      // Disable send buttons for the duration of the button's animation
      this.disableSendButtons = true
      setTimeout(() => {
        this.disableSendButtons = this.hasErrors
      }, 4000)
    }
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
      20% {
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
