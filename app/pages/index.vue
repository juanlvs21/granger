<template>
  <div>
    <CarouselImages />

    <div class="container granger__whatweoffer-container">
      <WhatWeOffer v-for="(offer, i) in whatWeOffer" :key="i" :offer="offer" />
    </div>

    <div class="container">
      <h1 class="granger__books-title is-size-2 has-text-centered">
        Populares
      </h1>
      <CarouselFeatured :books="books" />
    </div>

    <OfferWeek :book="books[0]" />

    <div class="container">
      <h1 class="granger__books-title is-size-2 has-text-centered">
        Nuevos Libros
      </h1>
      <div class=" granger__books-container">
        <Notification v-if="error" :message="error" />
        <BookCard v-else v-for="book in books" :key="book.uuid" :book="book" />
      </div>
    </div>

    <Newsletter />
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'
import CarouselFeatured from '~/components/home/CarouselFeatured'
import CarouselImages from '~/components/home/carousel-images/Carousel'
import WhatWeOffer from '~/components/home/WhatWeOffer'
import Newsletter from '~/components/home/Newsletter'
import BookCard from '~/components/books/Card'
import OfferWeek from '~/components/offer-week/OfferWeek'

export default {
  name: 'Home-Page',
  transition: 'fade',
  head() {
    return {
      title: 'Inicio | Granger'
    }
  },
  components: {
    Notification,
    CarouselImages,
    CarouselFeatured,
    WhatWeOffer,
    Newsletter,
    BookCard,
    OfferWeek
  },
  data() {
    return {
      error: null,
      books: [],
      whatWeOffer: [
        {
          title: 'Descarga imediata',
          subtitle:
            'Instantaneamenta te dejaremos tu pedido en tu correo electrónico',
          icon: 'fas fa-download'
        },
        {
          title: 'Mejores precios',
          subtitle: 'Libros al alcance de todos, ¿Qué esperas?',
          icon: 'fas fa-dollar-sign'
        },
        {
          title: 'Soporte 24X7',
          subtitle: 'Estaremos para ti siempre que nos necesites',
          icon: 'fas fa-handshake'
        }
      ]
    }
  },
  asyncData({ $axios }) {
    return $axios.$get(`${process.env.URL_SERVER}/api/books/all`).then(res => {
      return { books: res.data }
      // return { error: 'Ha ocurrido un error' }
    })
  }
}
</script>

<style scoped lang="scss">
.granger__whatweoffer-container {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.granger__books-title {
  margin-top: 30px;
}
.granger__books-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
