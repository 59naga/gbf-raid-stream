<template>
  <div>
    <ul v-if="!$store.state.initialized"><li>Loading...</li></ul>
    <header v-if="$store.state.initialized">
      <ul v-if="target.length === 0"><li>なんもないぜ</li></ul>
      <ul v-else>
        <tweet
          v-for="data in target"
          :key="data.tweet.urlOrigin"
          :data="data"
        />
      </ul>
    </header>
    <footer v-if="$store.state.initialized">
      <section v-if="$store.state.options.index == 0">
        <boss-check v-for="boss in standard" :key="boss.alias" :boss="boss" />
      </section>
      <section v-if="$store.state.options.index == 1">
        <boss-check v-for="boss in impossible" :key="boss.alias" :boss="boss" />
      </section>
      <section v-if="$store.state.options.index == 2">
        <boss-check v-for="boss in event" :key="boss.alias" :boss="boss" />
      </section>
      <section v-if="$store.state.options.index == 3">
        <boss-check v-for="boss in misc" :key="boss.alias" :boss="boss" />
      </section>

      <div>
        <label>
          <input type="radio" v-model="$store.state.options.index" value="0">
          Normal
        </label>
        <label>
          <input type="radio" v-model="$store.state.options.index" value="1">
          HighLevel
        </label>
        <label>
          <input type="radio" v-model="$store.state.options.index" value="2">
          Event
        </label>
        <label>
          <input type="radio" v-model="$store.state.options.index" value="3">
          Misc
        </label>
        <button @click="$store.commit('reset')" type="button">Reset</button>
      </div>
      <div>
        <label>
          <input type="radio" v-model="$store.state.options.index" value="-1">
          Hide
        </label>
        <label>
          <input type="checkbox" v-model="$store.state.options.sound">
          Sound On
        </label>
      </div>
      <h1>
        <a href="https://github.com/59naga/gbf-raid-stream">gbf-raid-stream v0.0.0</a>
      </h1>
    </footer>
  </div>
</template>

<script>
import { Howl } from 'howler'
import BossCheck from './BossCheck'
import Tweet from './Tweet'

let prevId, prevTabIds
const isDevelopment = process.env.NODE_ENV === 'development'
const sound = new Howl({
  src: [isDevelopment ? 'sound.mp3' : 'http://jsrun.it/assets/W/v/C/p/WvCpZ.mp3'],
  volume: 0.5
})

export default {
  components: {
    BossCheck,
    Tweet
  },
  computed: {
    target() {
      const { tabs, options, tweets, indexes, bosses } = this.$store.state
      const tab = tabs[0]
      const target = tweets.reduce((target, tweet) => {
        const index = indexes[tweet.name]
        const boss = bosses[index] || {}

        if (tab.length === 0 || tab.indexOf(boss.alias) > -1) {
          target.push({ tweet, boss })
        }

        return target
      }, [])

      // 絞り込みが変更されておらず、「１件目のidが代わったとき」に音を鳴らす
      const id = (target.map(({ tweet }) => tweet.id) || [])[0]
      const tabIds = tab
      if (prevId && prevId !== id && prevTabIds === tabIds) {
        if (options.sound) {
          sound.play()
        }
      }
      prevId = id
      prevTabIds = tabIds

      target.length = target.length > 100 ? 100 : target.length

      return target
    },
    standard() {
      return this.$store.state.bosses.filter(boss => boss.category.match(/^standard/))
    },
    impossible() {
      return this.$store.state.bosses.filter(boss => boss.category.match(/^impossible/))
    },
    event() {
      return this.$store.state.bosses.filter(boss => boss.category === 'event')
    },
    misc() {
      return this.$store.state.bosses.filter(boss => boss.category.match(/^misc/))
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  box-shadow: 0px -15px 20px 4px rgba(0, 0, 0, 0.2);
}
h1 {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 0;
  font-size: small;
}
</style>
