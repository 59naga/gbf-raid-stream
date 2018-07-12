import Vue from 'vue'
import Vuex from 'vuex'
import VueToasted from 'vue-toasted'
import VueClipboard2 from 'vue-clipboard2'
import VueMoment from 'vue-moment'

import 'moment/locale/es'
import 'moment/locale/ja'
import moment from 'moment'

import createStore from './store'

import App from './containers/App'
import Tab from './components/Tab'

Vue.use(Vuex)
Vue.use(VueToasted)
Vue.use(VueClipboard2)
Vue.use(VueMoment, { moment })

Vue.filter('localize', function(name, state) {
  const index = state.indexes[name]
  const boss = state.bosses[index] || {}
  const category = boss.category || 'unknown'
  const nameLocaled = boss.name || name
  if (!boss.name) {
    return nameLocaled
  }

  let short = nameLocaled.replace(/Lv\d+ /, '')
  if (category.match('impossible')) {
    short += 'HL'
  }
  if (category.match('misc')) {
    if (boss.name.match(/^Lv20/)) short += 'N'
    if (boss.name.match(/^Lv50/)) short += 'H'
    if (boss.name.match(/^Lv60/)) short += 'H+'
  }

  return short
})

new Vue({
  el: '#app',
  store: createStore(),
  components: { App, Tab },
  template: `
    <app>
      <tab />
    </app>
  `
})
