import Vue from 'vue'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { localize } from 'vee-validate'
import es from 'vee-validate/dist/locale/es.json'

// vee-validate
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)
localize('es', es)
