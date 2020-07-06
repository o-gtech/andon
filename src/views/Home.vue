<template>
  <m-typography class="home">
    <m-typo-headline :level="2">
      Sistema ANDON
    </m-typo-headline>
    <div class="selection">
      <m-select v-model="plant" id="select-plant" enhanced>
        <template slot="default">
          <m-list-item data-value="planta1">Planta 1</m-list-item>
          <m-list-item data-value="planta2">Planta 2</m-list-item>
          <m-list-item data-value="planta3">Planta 3</m-list-item>
        </template>
        <m-floating-label for="select-plant" id="select-plant--label" slot="label">Planta</m-floating-label>
        <m-line-ripple slot="line"/>
      </m-select>
      <m-select v-model="machine" id="select-machine" enhanced>
        <template slot="default">
          <m-list-item data-value="machine1">Maquina 1</m-list-item>
          <m-list-item data-value="machine2">Maquina 2</m-list-item>
          <m-list-item data-value="machine3">Maquina 3</m-list-item>
        </template>
        <m-floating-label for="select-machine" id="select-machine--label" slot="label">Máquina</m-floating-label>
        <m-line-ripple slot="line"/>
      </m-select>
      <m-text-field v-model="message" id="select--message" outlined>
        <m-floating-label for="select--message">Mensaje</m-floating-label>
      </m-text-field>
    </div>
    <div class="area">
      <m-card class="area--card card">
        <m-icon-button icon="group_work"></m-icon-button>
        <m-typo-headline :level="6">HSE</m-typo-headline>
      </m-card>
      <m-card class="area--card card">
        <m-icon-button icon="supervisor_account"></m-icon-button>
        <m-typo-headline :level="6">Operaciones</m-typo-headline>
      </m-card>
      <m-card class="area--card card">
        <m-icon-button icon="build"></m-icon-button>
        <m-typo-headline :level="6">Herramentales</m-typo-headline>
      </m-card>
      <m-card class="area--card card">
        <m-icon-button icon="construction" @click="sendText('maintenance')"></m-icon-button>
        <m-typo-headline :level="6">Mantenimiento</m-typo-headline>
      </m-card>
      <m-card class="area--card card">
        <m-icon-button icon="local_police"></m-icon-button>
        <m-typo-headline :level="6">Calidad</m-typo-headline>
      </m-card>
    </div>
  </m-typography>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import MessageService from '../services/MessageService'

// @ts-ignore
import Typography from 'material-components-vue/dist/typography'
// @ts-ignore
import Select from 'material-components-vue/dist/select'
// @ts-ignore
import List from 'material-components-vue/dist/list'
// @ts-ignore
import TextField from 'material-components-vue/dist/text-field'
// @ts-ignore
import Card from 'material-components-vue/dist/card'
// @ts-ignore
import IconButton from 'material-components-vue/dist/icon-button'
// @ts-ignore
import FloatingLabel from 'material-components-vue/dist/floating-label'
// @ts-ignore
import LineRipple from 'material-components-vue/dist/line-ripple'

Vue.use(Typography)
Vue.use(Select)
Vue.use(List)
Vue.use(TextField)
Vue.use(Card)
Vue.use(IconButton)
Vue.use(FloatingLabel)
Vue.use(LineRipple)

@Component
export default class Home extends Vue {
  private plant = ''
  private machine = ''
  private message = ''
  private phone = '+5218181757838'

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
        console.log(response.data)
      })
      .catch((error: any) => {
        console.log(error.response.data)
      })
  }
}
</script>

<style lang="scss">
@import "material-components-vue/dist/typography/styles";
@import "material-components-vue/dist/select/styles";
@import "material-components-vue/dist/list/styles";
@import "material-components-vue/dist/text-field/styles";
@import "material-components-vue/dist/card/styles";
@import "material-components-vue/dist/icon-button/styles";
@import "material-components-vue/dist/floating-label/styles";
@import "material-components-vue/dist/line-ripple/styles";

.selection {
  margin-top: 36px;
  display: flex;
  flex-direction: row;
  width: 100%;
  flex-wrap: wrap;

  > * {
    margin-right: 8px;
    margin-bottom: 8px;
    flex-grow: 1;
  }

  > :last-child {
    flex-grow: 2;
  }
}

.area {
  margin-top: 24px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;

  > * {
    margin-right: 8px;
    margin-bottom: 8px;
  }

  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 8px;
  }

  .mdc-icon-button {
    $icon-size: 72px;
    $area-size: calc(#{$icon-size} * 2);

    width: $area-size;
    height: $area-size;
    font-size: $icon-size;
    color: $mdc-theme-primary;
  }
}
</style>
