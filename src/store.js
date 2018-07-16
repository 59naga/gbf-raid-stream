import Vuex from 'vuex'
import createIoClient from 'socket.io-client'
import Promise from 'bluebird'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'

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
  const jsonBossesUrl = 'https://raw.githubusercontent.com/59naga/gbf-raid-bosses/master/dist/gbf-raid-bosses.json'
  const jsonIndexesUrl = 'https://raw.githubusercontent.com/59naga/gbf-raid-bosses/master/dist/indexes.json'
  const gbfRaidServerUrl = 'https://gbf-raid-server.herokuapp.com/'
  const gbfRaidServer = createIoClient(gbfRaidServerUrl)

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
        for (var i = 0; i < state.tweets.length; i++) {
          if (state.tweets[i].id === payload.id) {
            state.tweets.splice(i, 1)
            i--
          }
        }
        state.tweets.unshift(payload)
        state.tweets.pop()
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
      async initialize({ commit }) {
        const { bosses, indexes, tweets } = await Promise.props({
          bosses: axios(jsonBossesUrl).then(res => res.data),
          indexes: axios(jsonIndexesUrl).then(res => res.data),
          tweets: fetchCache(gbfRaidServer)
        })

        commit('tweets', tweets)
        commit('bosses', bosses)
        commit('indexes', indexes)
        commit('initialized')
      }
    }
  })

  store.dispatch('initialize')
  gbfRaidServer.on('gbf-raid-server:tweet', tweet => {
    store.commit('tweet', tweet)
  })

  return store
}
