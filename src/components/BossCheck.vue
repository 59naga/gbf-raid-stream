<template>
  <label :class="{dlh:boss.name.match(/250/)}">
    <input
      v-model="checked"
      :bind="$store.state.tabs"
      type="checkbox"
    >
    {{ boss.name | localize($store.state) }}
  </label>
</template>

<script>
export default {
  props: {
    boss: { type: Object, required: true }
  },
  computed: {
    checked: {
      get() {
        const tab = this.$store.state.tabs[0]
        return tab && tab.indexOf(this.boss.alias) > -1
      },
      set(checked) {
        this.$store.commit('toggle', this.boss.alias)
      }
    }
  }
}
</script>

<style scoped>
label {
  display: inline-block;
  width: 33%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

label.dlh {
  width: 66%;
}
</style>
