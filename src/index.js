;(async () => {
  const Vue = await import(/* webpackChunkName: "vue" */ 'vue')
  const Vuex = await import(/* webpackChunkName: "vuex" */ 'vuex')
  const VueToasted = await import(/* webpackChunkName: "vue-toasted" */ 'vue-toasted')
  const VueMoment = await import(/* webpackChunkName: "vue-moment" */ 'vue-moment')

  await import('moment/locale/es')
  await import('moment/locale/ja')
  const moment = await import(/* webpackChunkName: "moment" */ 'moment')

  const createStore = await import(/* webpackChunkName: "store" */ './store')

  const App = () => import('./containers/App')
  const Tab = () => import('./components/Tab')

  Vue.use(Vuex)
  Vue.use(VueToasted)
  Vue.use(VueMoment, { moment })

  Vue.filter('localize', function(data, state) {
    const name = data.boss ? data.boss.name || data.tweet.name : data
    const index = state.indexes[name]
    const boss = state.bosses[index] || {}
    const category = boss.category || 'unknown'
    const nameLocaled = boss.name || name
    if (category.match(/event\w+/)) {
      return nameLocaled
    }
    if (!boss.name) {
      return nameLocaled
    }

    let short = nameLocaled.replace(/Lv\d+ /, '')
    if (category.match('impossible') && !short.match(/HL$/)) {
      short += 'HL'
    }
    if (category.match('misc')) {
      if (boss.name.match(/^Lv20/)) short += 'N'
      if (boss.name.match(/^Lv50/)) short += 'H'
      if (boss.name.match(/^Lv60/)) short += 'H+'
    }

    return short
  })

  const vue = new Vue({
    store: createStore(),
    components: { App, Tab },
    template: `
      <app>
        <tab />
      </app>
    `
  })
  vue.$mount('#app')
})()
