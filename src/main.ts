import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import Dropdown from 'primevue/dropdown'
import Card from 'primevue/card'
import Listbox from 'primevue/listbox'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

Vue.use(ToastService)

Vue.component('Textarea', Textarea)
Vue.component('InputText', InputText)
Vue.component('Button', Button)
Vue.component('Toast', Toast)
Vue.component('Dropdown', Dropdown)
Vue.component('Card', Card)
Vue.component('Listbox', Listbox)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
