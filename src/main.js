// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'

// Plugins
import GlobalComponents from './globalComponents'
import GlobalDirectives from './globalDirectives'
import Notifications from './components/UIComponents/NotificationPlugin'
import SideBar from './components/UIComponents/SidebarPlugin'

import App from './App'

// library imports
import Chartist from 'chartist'
import VueTimeago from 'vue-timeago'
import VueSocketio from 'vue-socket.io'
import 'bootstrap/dist/css/bootstrap.css'
import './assets/sass/paper-dashboard.scss'
import 'es6-promise/auto'

// rickshaw
// eslint-disable-line
/* eslint-disable */

import * as d3 from 'd3'
import jQuery from 'jquery'
window.jQuery = jQuery

import 'jquery-ui/themes/base/core.css'
import 'jquery-ui/themes/base/theme.css'
import 'jquery-ui/ui/core'
import 'jquery-ui/themes/base/slider.css'
import 'jquery-ui/ui/widgets/slider'
import 'jquery-ui/ui/widgets/sortable'
import 'jquery-ui/ui/disable-selection'

/* eslint-enable */

Vue.use(VueTimeago, {
  name: 'timeago', // component name, `timeago` by default
  locale: 'en-US',
  locales: {
    // you will need json-loader in webpack 1
    'en-US': require('vue-timeago/locales/en-US.json')
  }
})

Vue.use(VueSocketio, `${window.location.hostname}:3000`)

// plugin setup
Vue.use(GlobalComponents)
Vue.use(GlobalDirectives)
Vue.use(Notifications)
Vue.use(SideBar)

// global library setup
Object.defineProperty(Vue.prototype, '$Chartist', {
  get () {
    return this.$root.Chartist
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  data: {
    Chartist: Chartist
  }
})
