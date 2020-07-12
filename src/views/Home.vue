<template>
  <div class="home">
    <div class="selection card">
      <span class="selection--dropdown p-float-label">
        <Dropdown id="plants-dropdown"
          v-model="selectedPlant"
          :options="plants"
          optionLabel="name"
          placeholder="Selecciona la planta"
          :filter="true"
        />
        <label for="plants-dropdown">Planta</label>
      </span>
      <span class="selection--dropdown p-float-label">
        <Dropdown id="machines-dropdown"
          v-model="selectedMachine"
          :options="machines"
          optionLabel="name"
          placeholder="Selecciona la máquina"
          :filter="true"
          :disabled="!showMachines"
        />
        <label for="machines-dropdown">Máquina</label>
      </span>
      <div class="selection--message message">
        <span class="message--input p-float-label">
          <InputText id="message"
            ref="message"
            type="text"
            v-model="message"
            @focus="showMessageTemplates = true"
          />
          <label for="message">Mensaje</label>
        </span>
        <div class="message--templates" :class="{ 'message--templates__visible': showMessageTemplates }">
          <Button class="p-button-secondary p-button-rounded"
            v-for="(value, index) in messageTemplates"
            :key="index"
            :label="value.message + (value.edit ? '...' : '')"
            @click="setMessage(value.message, value.edit)"
          />
        </div>
      </div>
    </div>
    <div class="area card">
      <Button class="area--button p-button-outlined p-button-info"
        v-for="(value, key, index) in areas"
        :key="index"
        :label="value"
        @click="sendText(key)"
      >
        <template slot="content">{{ value }}</template>
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import MessageService from '../services/MessageService'

interface Record {
  readonly name: string;
}

const emptyRecord: Record = {
  name: ''
}

@Component
export default class Home extends Vue {
  private selectedPlant = emptyRecord
  private selectedMachine = emptyRecord
  private showMachines = false
  private plants: Record[] = []
  private machines: Record[] = []
  private message = ''
  private showMessageTemplates = false
  private messageTemplates = [
    { message: 'Mantenimiento', edit: false },
    { message: 'Falta de ', edit: true },
    { message: 'Cambio de ', edit: true },
    { message: 'Inspección', edit: false }
  ]

  private phone = '+5218181757838'
  private areas = {
    hse: 'HSE',
    operations: 'Operaciones',
    tooling: 'Herramentales',
    maintenance: 'Mantenimiento',
    quality: 'Calidad'
  }

  get plant (): string {
    return this.selectedPlant.name
  }

  get machine (): string {
    return this.selectedMachine.name
  }

  mounted () {
    this.plants = this.getPlants()
  }

  @Watch('selectedPlant')
  public fetchMachines () {
    this.showMachines = false // Wait until we receive data from server
    // TODO: Get the plant's machines from server
    this.machines = this.getMachines(this.plant)
    this.showMachines = true
  }

  @Watch('selectedMachine')
  public activateMessageTemplates () {
    this.focusMessageInput()
    this.showMessageTemplates = true
  }

  public focusMessageInput () {
    ((this.$refs.message as Vue).$el as SVGElement).focus() // https://forum.vuejs.org/t/vetur-bug-or-code-error-property-el-does-not-exist-on-type-svgelement/73696
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

  public setMessage (text: string, edit: boolean): void {
    this.message = text
    if (edit) {
      this.focusMessageInput()
    }
    this.showMessageTemplates = false
  }

  public sendText (area: string): void {
    const data = {
      plant: this.plant,
      machine: this.machine,
      area: area,
      message: this.message,
      phone: this.phone
    }

    MessageService.send(data)
      .then((response: any) => {
        this.$toast.add({ severity: 'success', summary: 'Mensaje mandado!', detail: response.data, life: 3000 })
      })
      .catch((error: any) => {
        const errorMessage = error.response ? error.response.data : 'No se pudo conectar con el servidor.'
        this.$toast.add({ severity: 'error', summary: errorMessage, detail: 'Porfavor intentelo de nuevo', life: 3000 })
      })
  }
}
</script>

<style lang="scss" scoped>
.card {
  background-color: var(--surface-e);
  padding: 2rem;
  border-radius: 6px;
  box-shadow: 0 0 12px -2px rgba(0, 0, 0, 0.1);

  margin-left: 12px !important;
  margin-right: 12px !important;
}

.selection {
  $margin-between-components: 8px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: -$margin-between-components;
  margin-bottom: 24px;

  > * {
    margin-right: $margin-between-components;
    margin-bottom: $margin-between-components;
  }

  // &--dropdown {
  //   > label {
  //     z-index: -1; // Fix floating label overlapping placeholder
  //   }

  //   > .p-disabled + label {
  //     opacity: 0; // Fix floating label overlapping placeholder on disabled input
  //   }
  // }

  &--message {
    flex-grow: 1;
  }

  .message {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    &--input input {
      width: 100%;
    }

    &--templates {
      transition: all 0.5s;
      opacity: 0;
      height: 0;
      overflow: hidden;
      padding: 4px;

      &__visible {
        opacity: 1;
        height: auto;
        margin-top: 12px;
      }

      button {
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }
  }
}

.area {
  $margin-between-cards: 8px;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-right: -$margin-between-cards;

  &--button {
    margin-right: $margin-between-cards;
    margin-bottom: $margin-between-cards;
    flex-grow: 1;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
  }
}
</style>
