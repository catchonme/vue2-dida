import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import '../src/style/css.css'
import '../src/style/icon.css'
import '../src/style/common.scss'
import './config/rem'

Vue.use(MuseUI)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
