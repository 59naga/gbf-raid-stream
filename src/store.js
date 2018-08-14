import Vuex from 'vuex'
import createIoClient from 'socket.io-client'
import Promise from 'bluebird'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

import Visibility from 'visibilityjs'

const jsonBossesUrl = 'https://unpkg.com/@59naga/gbf-data/dist/raid.json'
const gbfRaidServerUrl = 'https://gbf-raid-server.herokuapp.com/'

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
  const store = new Vuex.Store({
    state: {
      tabs: [[]],
      options: {
        index: 0,
        sound: false
      },
      tweets: [],
      bosses: [],
      categories: [],
      indexes: {},
      initialized: false
    },
    plugins: [createPersistedState({ paths: ['tabs', 'options'] })],
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
      }
    },
    actions: {
      async initialize({ commit }, gbfRaidServer) {
        commit('initialize')

        const { tweets, bosses } = await Promise.props({
          tweets: fetchCache(gbfRaidServer),
          bosses: axios(jsonBossesUrl).then(res =>
            res.data.map(boss => {
              // pbs.twiimgの画像で末尾がjpgなら軽量版のurlに変更する
              if (boss.image.match(/pbs.twimg.com.+?.?jpg$/)) {
                boss.image += ':small'
              }
              return boss
            })
          )
        })

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

  // ウィンドウが非アクティブになった時socket.ioを切断し、再度アクティブになった時にinitializeを再度実行する
  const onVisble = () => {
    const gbfRaidServer = createIoClient(gbfRaidServerUrl)
    store.dispatch('initialize', gbfRaidServer).then(() => {
      gbfRaidServer.on('gbf-raid-server:tweet', tweet => {
        store.commit('tweet', tweet)
      })
    })
    return gbfRaidServer
  }

  let gbfRaidServer = onVisble()
  Visibility.change((event, state) => {
    if (state === 'visible') {
      gbfRaidServer = onVisble()
    } else {
      gbfRaidServer.close()
    }
  })

  return store
}
