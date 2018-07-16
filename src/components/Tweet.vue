<template>
  <li @click="doCopy(data.tweet)" :class="{copied}">
    <figure><img :src="data.boss.image+':small'" alt=""></figure>
    <figcaption>
      <h2>{{ data.boss.name | localize($store.state) }}</h2>
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
// TODO: 全く同じ内容のオブジェクトがtweetsに存在するときがある
export default {
  props: {
    data: { type: Object, required: true }
  },
  data() {
    return { copied: false }
  },
  methods: {
    async doCopy(tweet) {
      // https://github.com/vuejs/Discussion/issues/405#issuecomment-142089920
      const localizedName = this.$options.filters.localize(this.data.boss.name, this.$store.state)
      const localizedTime = this.$options.filters.moment(this.data.tweet.createdAt, 'from', 'now')
      const title = `${tweet.id} ${localizedName} ${localizedTime}`

      await this.$copyText(title)
      this.$toasted.show(`コピー：${title}`, {
        position: 'top-center',
        duration: 1000
      })

      this.copied = true
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
