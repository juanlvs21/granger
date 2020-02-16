<template>
  <Carousel
    :perPage="1"
    :perPageCustom="[
      [500, 2],
      [768, 3],
      [1024, 4],
      [1440, 5]
    ]"
    :paginationEnabled="false"
    :autoplayTimeout="5000"
    autoplay
    autoplayHoverPause
    scrollPerPage
  >
    <Slide v-for="book in books" :key="book.uuid">
      <BookCard :book="book" />
    </Slide>
  </Carousel>
</template>

<script>
// Imports client
if (process.client) {
  var { Carousel, Slide } = require('vue-carousel')
}

// Components
import BookCard from '~/components/books/Card'

export default {
  name: 'Home-Carousel-Featured',
  props: ['books'],
  components: {
    Carousel,
    Slide,
    BookCard
  },
  data() {
    return {
      server: process.env.URL_SERVER
    }
  }
}
</script>

<style lang="scss">
.VueCarousel-slide {
  display: flex;
  justify-content: center;
  padding-top: 25px;
}
</style>
