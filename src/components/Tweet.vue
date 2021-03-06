<template>
  <li :class="{copied}" @click="doCopy(data.tweet)">
    <figure v-if="data.boss.image"><img :src="data.boss.image" alt=""></figure>
    <figure v-else><tco-img :cache-name="data.boss.name || data.tweet.name" :src="data.tweet.urlImage"/></figure>
    <figcaption>
      <h2>{{ data | localize($store.state) }}</h2>
      <p>
        <a :href="'https://' + data.tweet.urlOrigin" target="_blank">
          <img :src="data.tweet.urlProfile" alt="">
          <small>{{ data.tweet.memo }}</small>
          <small>{{ data.tweet.createdAt | moment('from', 'now') }}</small>
        </a>
      </p>
      <aside>{{ data.tweet.id }}</aside>
    </figcaption>
  </li>
</template>

<script>
import copy from 'clipboard-copy'
import TcoImg from './TcoImg'

let handshaken
window.addEventListener(
  'message',
  event => {
    if (event.data === 'handshake') {
      handshaken = event
    }
  },
  false
)

// TODO: 全く同じ内容のオブジェクトがtweetsに存在するときがある
export default {
  components: {
    TcoImg
  },
  props: {
    data: { type: Object, required: true }
  },
  computed: {
    copied() {
      const copied = this.$store.state.copied
      return copied.indexOf(this.data.tweet.id) > -1
    }
  },
  methods: {
    async doCopy(tweet, notify = false) {
      // https://github.com/vuejs/Discussion/issues/405#issuecomment-142089920
      const localizedName = this.$options.filters.localize(this.data, this.$store.state)
      const localizedTime = this.$options.filters.moment(this.data.tweet.createdAt, 'from', 'now')
      const title = `${tweet.id}／${localizedName} ${localizedTime}`
      const copyText = localizedName[0].match(/[A-Z0-9Ａ-Ｚ０-９]/) ? tweet.id : title // See: gbf-raid-stream#4

      try {
        if (handshaken && notify) {
          handshaken.source.postMessage(
            JSON.stringify({
              id: tweet.id,
              name: localizedName,
              memo: this.data.tweet.memo,
              image: this.data.boss.image
            }),
            handshaken.origin
          )
        } else if (navigator.permissions && navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(copyText)
        } else {
          await copy(copyText)
        }

        this.$store.state.visibility === 'visible' &&
          this.$toasted.show(`コピー：${title}`, {
            position: 'top-center',
            duration: 1000
          })

        this.$store.commit('copied', tweet)
      } catch (error) {
        console.error(error)
        this.$store.state.visibility === 'visible' &&
          this.$toasted.show(`コピー失敗：${title}`, {
            position: 'top-center',
            duration: 1000,
            type: 'error'
          })
      }
    }
  }
}
</script>

<style scoped>
li {
  position: relative;
  cursor: pointer;
  font-size: x-large;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
}
li:hover {
  opacity: 0.5;
}
li figure,
li figcaption {
  margin: 0;
  display: inline-block;
}
li figure {
  vertical-align: middle;
  min-width: 2.5em;
  width: 2.5em;
  max-height: 2.2em;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
li figure img {
  width: 4em;
  min-height: 100%;
}

small {
  font-size: x-small;
}

figcaption {
  padding: 0.25em;
}
figcaption aside {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 5em;
  font-size: xx-large;
  opacity: 0.2;
  font-family: Terminal, Monaco, monospace;
}
figcaption h2 {
  margin: 0;
  font-size: small;
}
a {
  text-decoration: none;
}
p {
  margin: 0;
}
p img {
  width: 0.8em;
}

.copied {
  opacity: 0.25;
}
</style>
