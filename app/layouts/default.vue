<template>
  <div>
    <Navbar />
    <div class="granger__content">
      <nuxt />
    </div>
    <Footer />
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
  /* position: relative; */
}
</style>
