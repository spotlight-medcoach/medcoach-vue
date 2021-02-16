import Vue from 'vue'
import VueHtmlToPaper from 'vue-html-to-paper'
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes'
  ],
  styles: [
    '/print.css',
    '/css/quill.bubble.css',
    '/css/quill.core.css',
    '/css/quill.snow.css'
  ]
}
Vue.use(VueHtmlToPaper, options)
