<template>
  <div>
    <Navbar />
    <div class="granger__content">
      <nuxt />
      <Footer />
    </div>
  </div>
</template>

<script>
// Components
import Navbar from '~/components/core/Navbar'
import Footer from '~/components/core/Footer'

export default {
  name: 'Default-Layout',
  components: {
    Navbar,
    Footer
  }
}
</script>

<style scoped lang="scss">
.granger__content {
  height: calc(100vh - 52px);
  overflow-y: scroll;
}
</style>
