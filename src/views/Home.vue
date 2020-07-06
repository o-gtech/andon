<template>
  <div class="home">
    <div class="selection">
      <span class="p-float-label">
        <Dropdown id="plants-dropdown" v-model="selectedPlant" :options="plants" optionLabel="name" placeholder="Selecciona la planta" :filter="true" />
        <label for="plants-dropdown" v-show="plant.length">Planta</label>
      </span>
      <span class="p-float-label">
        <Dropdown id="machines-dropdown" v-model="selectedMachine" :options="machines" optionLabel="name" placeholder="Selecciona la máquina" :filter="true" :disabled="!showMachines" />
        <label for="machines-dropdown" v-show="machine.length">Máquina</label>
      </span>
      <InputText class="selection--message" type="text" v-model="message" />
    </div>
    <div class="area">
      <Button v-for="(value, key, index) in areas" :key="index" :label="value" @click="sendText(key)" class="area--button p-button-outlined p-button-info">
        <template slot="content">{{ value }}</template>
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import MessageService from '../services/MessageService'

@Component
export default class Home extends Vue {
  private selectedPlant = { name: '' }
  private selectedMachine = { name: '' }
  private showMachines = false
  private plants: { name: string }[] = []
  private machines: { name: string }[] = []
  private message = ''
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

  public getPlants (): { name: string }[] {
    const plants = [
      { name: 'Alameda' },
      { name: 'Calabazas' },
      { name: 'Murrieta' }
    ]
    return plants
  }

  public getMachines (plant: string): { name: string }[] {
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

  &--message {
    flex-grow: 1;
  }
}

.area {
  $margin-between-cards: 12px;

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
