;(async () => {
  const Vue = (await import('vue')).default
  const Vuex = (await import('vuex')).default
  const VueToasted = (await import('vue-toasted')).default
  const VueClipboard2 = (await import('vue-clipboard2')).default
  const createStore = (await import('./store')).default

  await import('moment/locale/es')
  await import('moment/locale/ja')
  const moment = (await import('moment')).default
  const VueMoment = (await import('vue-moment')).default

  const App = () => import('./containers/App')
  const Tab = () => import('./components/Tab')

  Vue.use(VueMoment, { moment })
  Vue.use(Vuex)
  Vue.use(VueToasted)
  Vue.use(VueClipboard2)

  Vue.filter('localize', function(name, state) {
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
})()
