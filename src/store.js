import Vuex from 'vuex'
import createIoClient from 'socket.io-client'
import Promise from 'bluebird'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

import isMobile from 'is-mobile'
import Visibility from 'visibilityjs'

const jsonBossesUrl = 'https://unpkg.com/gbf-data@0.0.28/dist/raid.json'
const gbfRaidServerUrl = 'https://v157-7-52-20.z1d20.static.cnode.jp/'

function fetchCache(gbfRaidServer) {
  return new Promise((resolve, reject) => {
    gbfRaidServer.emit('gbf-raid-server:cache', (error, tweets) => {
      if (error) {
        reject(error)
      } else {
        resolve(tweets)
      }
    })
  })
}

export default () => {
  let gbfRaidServer
  const store = new Vuex.Store({
    state: {
      visibility: 'visible',
      tabs: [[]],
      copied: [],
      options: {
        index: 0,
        sound: false
      },
      tweets: [],
      bosses: [],
      categories: [],
      indexes: {},
      initialized: false,
      allowedAC: null
    },
    plugins: [createPersistedState({ paths: ['tabs', 'copied', 'options'] })],
    mutations: {
      // initialize / lifecycles
      tweet(state, payload) {
        let isUnique = true
        for (var i = 0; i < state.tweets.length; i++) {
          if (state.tweets[i].id === payload.id) {
            state.tweets.splice(i, 1)
            isUnique = false
            i--
          }
        }
        state.tweets.unshift(payload)
        if (isUnique) {
          state.tweets.pop()
        }
      },
      tweets(state, payload) {
        state.tweets = payload
      },
      bosses(state, payload) {
        state.bosses = payload
      },
      indexes(state, payload) {
        state.indexes = payload
      },
      initialize(state) {
        state.initialized = false
      },
      initialized(state) {
        state.initialized = true
      },

      // handlers
      visibility(state, visibility) {
        state.visibility = visibility
      },
      reset(state) {
        state.tabs[0].splice(0, state.tabs[0].length)
      },
      toggle(state, payload) {
        const index = state.tabs[0].indexOf(payload)
        if (index === -1) {
          state.tabs[0].push(payload)
        } else {
          state.tabs[0].splice(index, 1)
        }
      },
      copied(state, { id }) {
        if (state.copied.indexOf(id) > -1) {
          return
        }

        state.copied.unshift(id)
        if (state.copied.length > 10) {
          state.copied.pop()
        }
      },
      allowAC(state, permissionState) {
        state.allowedAC = permissionState === 'granted' || permissionState === 'prompt'
      }
    },
    actions: {
      async pause() {
        if ((gbfRaidServer && gbfRaidServer.on) === false) {
          // 接続が確立していない（gbfRaidServerがない）場合スキップ
          return
        }

        gbfRaidServer.close()
      },
      async initialize({ commit }) {
        commit('initialize')

        gbfRaidServer = createIoClient(gbfRaidServerUrl)
        gbfRaidServer.on('gbf-raid-server:tweet', tweet => {
          store.commit('tweet', tweet)
        })

        const tweets = await fetchCache(gbfRaidServer)
        const bosses = await axios(jsonBossesUrl).then(res =>
          res.data.map(boss => {
            // pbs.twiimgの画像で末尾がjpgなら軽量版のurlに変更する
            if (boss.image.match(/pbs.twimg.com.+?.?jpg$/)) {
              boss.image += ':small'
            }
            return boss
          })
        )

        const indexes = bosses.reduce((indexes, boss, index) => {
          indexes[boss.name] = index
          indexes[boss.name_en] = index
          return indexes
        }, {})

        commit('tweets', tweets)
        commit('bosses', bosses)
        commit('indexes', indexes)
        commit('initialized')
      }
    }
  })

  if (navigator.permissions) {
    navigator.permissions.query({ name: 'clipboard-write' }).then(permissionStatus => {
      store.commit('allowAC', permissionStatus.state)
      permissionStatus.addEventListener('change', () => {
        store.commit('allowAC', permissionStatus.state)
      })
    })
  }

  Visibility.change((event, state) => {
    store.commit('visibility', state)
  })

  // ウィンドウが非アクティブになった時socket.ioを切断し、再度アクティブになった時にinitializeを再度実行する
  const onVisble = () => {
    store.dispatch('initialize')
  }

  onVisble()
  if (isMobile()) {
    Visibility.change((event, state) => {
      if (state === 'visible') {
        onVisble()
      } else {
        store.dispatch('pause')
      }
    })
  }

  return store
}
