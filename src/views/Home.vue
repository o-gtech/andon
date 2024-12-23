<template>
  <div class="home">
    <div class="home__header">
      <h1 class="home__title">Nuevo Reporte</h1>
      <ActionsMenu
        :disableRestore="!lastSentReport"
        v-on:restore="restoreReport()"
        :disableClear="!selectedPlant && !selectedMachine && !selectedReportType && !comment"
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
            :placeholder="machines ? 'Selecciona la máquina' : ''"
            :filter="machines && machines.length > 6"
            filterPlaceholder="Busca la máquina"
            :disabled="!machines"
          />
          <InlineMessage severity="error" v-show="showErrors && formErrors.machine">Selecciona una máquina</InlineMessage>
        </div>
      </div>

      <div class="card__container selection__50-50">
        <div class="selection__wrapper">
          <div class="selection__title">Area</div>
          <Listbox class="listbox"
            :class="{ 'p-error' : showErrors && formErrors.area, 'p-disabled': !areas }"
            v-model="selectedArea"
            :options="areas ? areas : areasPlaceholder"
            optionLabel="id"
            listStyle="max-height: 8rem"
            :filter="areas && areas.length > 6"
            filterPlaceholder="Busca el area"
            :disabled="!areas"
          >
            <template #option="slotProps">
              <div class="listbox__item">
                <span class="listbox__item-badge p-badge p-badge-secondary">
                  {{slotProps.option.name[0]}}
                </span>
                <span class="listbox__item-name">{{slotProps.option.name}}</span>
              </div>
            </template>
          </Listbox>
          <InlineMessage severity="error" v-show="showErrors && formErrors.area">Selecciona un area</InlineMessage>
        </div>
        <div class="selection__wrapper">
          <div class="selection__title">Tipo de reporte</div>
          <Listbox class="listbox"
            :class="{ 'p-error' : showErrors && formErrors.reportType, 'p-disabled': !reportTypes }"
            v-model="selectedReportType"
            :options="reportTypes ? reportTypes : reportTypesPlaceholder"
            optionLabel="id"
            listStyle="max-height: 8rem"
            :filter="reportTypes && reportTypes.length > 6"
            filterPlaceholder="Busca el tipo de reporte"
            :disabled="!reportTypes"
          >
            <template #option="slotProps">
              <div class="listbox__item">
                <span class="listbox__item-badge p-badge"
                  :class="`p-badge-${getSeverityStatus(slotProps.option.severity)}`"
                >
                  {{slotProps.option.severity}}
                </span>
                <span class="listbox__item-name">{{slotProps.option.name}}</span>
              </div>
            </template>
          </Listbox>
          <InlineMessage severity="error" v-show="showErrors && formErrors.area">Selecciona un tipo de reporte</InlineMessage>
        </div>
      </div>
      <div class="card__container">
        <div class="comment selection__wrapper">
          <div class="selection__title">Comentarios (opcional)</div>
          <Textarea id="comment"
            ref="comment"
            v-model="comment"
            rows="3"
            :autoResize="true"
            @focus="showCommentTemplates = true"
            :disabled="!reportTypes"
            placeholder="Comentarios, observaciónes y/o notas extra que se quiera añadir..."
          />
          <div class="comment__templates" :class="{ 'comment__templates--visible': showCommentTemplates }">
            <Button class="p-button-secondary p-button-rounded"
              v-for="(value, index) in commentTemplates"
              :key="index"
              :label="value.comment + (value.edit ? '...' : '')"
              @click="setCommentInTextarea(value.comment, value.edit)"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="send card card--no-background">
      <!-- <div class="card__title">Status del reporte</div> -->
      <div class="card__container">
        <Button class="send__button"
          @click="areaButtonClickHandler($event)"
          :disabled="disableSendButtons"
        >
          Mandar reporte
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

import { Plant, Machine, Area, ReportType, Report } from '../typings'
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
      reportTypes {
        id
        name
        severity
      }
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
  $reportTypeID: ID!,
  $plantID: ID!,
  $areaID: ID!,
  $machineID: ID!,
  $comment: String!
) {
  createReport(
    creation_date: $creationDate,
    assist_date: $assistDate,
    solved_date: $solvedDate,
    reportType: $reportTypeID,
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

  // Area
  private selectedArea: Area = NULL
  private areas: Area[] = NULL
  readonly areasPlaceholder: Area[] = [
    { id: NULL, name: 'Herramentales', phones: NULL, reportTypes: NULL },
    { id: NULL, name: 'Operaciones', phones: NULL, reportTypes: NULL }
  ]

  // ReportType
  private selectedReportType: ReportType = NULL
  private reportTypes: ReportType[] = NULL
  readonly reportTypesPlaceholder: ReportType[] = [
    { id: NULL, name: 'Mantenimiento', severity: 5 },
    { id: NULL, name: 'Fallo', severity: 9 }
  ]

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
    area: true,
    reportType: true
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

  @Watch('selectedArea')
  public areaSelected () {
    const area = this.selectedArea
    if (area) {
      if (area.reportTypes.length !== 0) this.reportTypes = this.sortReportTypes(area.reportTypes)
      this.formErrors.area = false
    } else {
      this.formErrors.area = true
    }

    this._checkSendButtons()
  }

  @Watch('selectedReportType')
  public reportTypeSelected () {
    if (this.selectedReportType) {
      if (!this.comment) this.showCommentTemplates = true
      this.formErrors.reportType = false
    } else {
      this.formErrors.reportType = true
    }

    this._checkSendButtons()
  }

  private log (data: any) {
    console.log(data)
  }

  private _checkSendButtons () {
    if (this.hasErrors) {
      this.disableSendButtons = true
    } else {
      this.disableSendButtons = false
    }
  }

  public sortReportTypes (reportTypes: ReportType[]): ReportType[] {
    return reportTypes.sort((a, b): number => (
      a.severity > b.severity) ? 1 : (a.severity === b.severity) ? ((a.name > b.name) ? 1 : -1) : -1
    )
  }

  public getSeverityStatus (severity: number): string {
    if (severity < 4) {
      return 'info'
    }

    if (severity >= 4 && severity <= 7) {
      return 'warning'
    }

    return 'danger'
  }

  public setCommentInTextarea (text: string, edit: boolean): void {
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
      this.selectedReportType = this.lastSentReport.reportType
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
      area: !this.selectedArea,
      reportType: !this.selectedReportType
    }

    this.showErrors = this.hasErrors
  }

  private _animateSendButton (button: HTMLElement, sent: boolean) {
    const animationClass = 'send__button--' + (sent ? 'sent' : 'error')

    button.classList.add(animationClass)
    button.blur()

    // Remove after animation ends to be able to trigger it again
    setTimeout(() => {
      button.classList.remove(animationClass)
    }, 4000)
  }

  private _sendText (): boolean {
    const message = `Máquina ${this.selectedMachine.name} de la planta ${this.selectedPlant.name}` +
                    `[${this.selectedReportType.name}]\n` +
                    `Area ${this.selectedArea.name} notificada` + this.comment ? ` por ${this.comment}` : ''
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
    this.selectedReportType = NULL
    this.comment = ''

    this.machines = NULL
    this.areas = NULL
    this.reportTypes = NULL
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
          reportTypeID: this.lastSentReport.reportType.id,
          areaID: this.lastSentReport.area.id,
          comment: this.lastSentReport.comment
        }
        // update: (store: any, { data: { createReport } }: any) => {
        //   const data = store.readQuery({ query: allReportsQuery })
        //   data.allReports.push(createReport)
        //   store.writeQuery({ query: allReportsQuery, data })
        // }
      }).then(({ data }: any) => {
        this.lastSentReport.id = data.createReport.id
        console.log(data)
        resolve(true)
      }).catch((error) => {
        console.error(error)
        resolve(false)
      })
    })
  }

  public async areaButtonClickHandler (event: any) {
    const button = event.target

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
      reportType: this.selectedReportType,
      area: this.selectedArea,
      comment: this.comment
    }

    // Send and save report
    this.lastSentReport.sent = this._sendText()
    this._animateSendButton(button, this.lastSentReport.sent)

    this.lastSentReport.saved = await this._saveReport()

    if (this.lastSentReport.sent || this.lastSentReport.saved) this._clearInputs()

    if (this.lastSentReport.sent) {
      this.showErrors = false
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
  box-shadow: 0 0 12px -2px rgba(0, 0, 0, .1);
  padding: 2rem;
  border-radius: 6px;

  &--no-background {
    background-color: inherit;
    box-shadow: none;
  }

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
    margin-bottom: 1.5rem !important;

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
    margin-top: 1.5rem !important;

    .selection__title {
      font-size: $label-size;
      margin: 0 0 .5rem .5rem;
    }

    .p-error {
      border-color: #f44336;
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

    .p-inline-message {
      width: 100%;
    }
  }

  .comment {
    display: flex;
    flex-direction: column;

    textarea {
      width: 100%;
      flex: 0 0 auto;
    }

    &__templates {
      @include gap-between-items(1rem, button);

      opacity: 0;
      overflow: hidden;
      height: 0;
      display: flex;
      flex-wrap: wrap;
      padding: .75rem .25rem 0;
      transition: opacity .5s, height .5s;

      &--visible {
        opacity: 1;
        height: 100%;
      }
    }
  }
}

.send {
  &__button {
    display: flex;
    font-size: 1rem;
    justify-content: center;
    margin: 0;
    transition: all .2s ease;
    width: 100%;
    box-shadow:
      0 4px 6px rgba(0, 0, 0, .1),
      0 1px 3px rgba(0, 0, 0, .08);

    @media screen and (min-width: 768px) {
      margin-left: auto !important;
      width: auto;
    }

    i {
      transition: transform .3s ease;
      margin-left: .25rem;
      transform: rotate(45deg);
    }

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
