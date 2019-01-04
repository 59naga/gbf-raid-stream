<template>
  <img>
</template>

<script>
import axios from 'axios'

export default {
  props: ['cacheName', 'src'],
  async mounted() {
    let url = localStorage.getItem(this.cacheName)
    if (!url) {
      const { data } = await axios(`https://v157-7-52-20.z1d20.static.cnode.jp/fetch-image?url=${this.src}`)
      url = data
    }

    if (url) {
      localStorage.setItem(this.cacheName, url)

      this.$el.setAttribute('src', `${url}:small`)
    }
  }
}
</script>

<style>
img {
  width: 5em;
  min-height: 100%;
}
</style>
