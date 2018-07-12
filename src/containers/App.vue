<script>
export default {
  functional: true,
  render(createElement, { data, children }) {
    return createElement('div', data, children)
  }
}
</script>

<style scoped>
div {
  max-width: 680px;
  position: relative;
}
/*  深い闇  */
div::after {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  content: '';
  background: url('http://jsrun.it/assets/Q/y/i/3/Qyi3U.png') no-repeat center center;
  opacity: 0.05;
  z-index: -1;
}
</style>
