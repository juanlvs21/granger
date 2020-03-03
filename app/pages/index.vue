<template>
  <div>
    <CarouselImages />

    <div class="container granger__whatweoffer-container">
      <WhatWeOffer v-for="(offer, i) in whatWeOffer" :key="i" :offer="offer" />
    </div>

    <div class="container" v-if="featuredBooks.length">
      <h1 class="granger__books-title is-size-2 has-text-centered">Libros Destacados</h1>
      <CarouselFeatured :books="featuredBooks" />
    </div>

    <OfferWeek v-if="offerWeek" :offer="offerWeek" />

    <div class="container" v-if="newBooks.length">
      <h1
        class="granger__books-title granger__books-title-new is-size-2 has-text-centered"
      >Nuevos Libros</h1>
      <div class="granger__books-container">
        <BookCard v-for="book in newBooks" :key="book.uuid" :book="book" />
      </div>
    </div>

    <Newsletter />
    <FollowUsInstagram />
  </div>
</template>

<script>
// Components
import Notification from '~/components/core/Notification'
import CarouselFeatured from '~/components/home/CarouselFeatured'
import CarouselImages from '~/components/home/carousel-images/Carousel'
import WhatWeOffer from '~/components/home/WhatWeOffer'
import Newsletter from '~/components/newsletter/Newsletter'
import BookCard from '~/components/books/Card'
import OfferWeek from '~/components/offer-week/OfferWeek'
import FollowUsInstagram from '~/components/follow-us-instagram/FollowUsInstagram'

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
    OfferWeek,
    FollowUsInstagram
  },
  data() {
    return {
      newBooks: [],
      featuredBooks: [],
      offerWeek: null,
      whatWeOffer: [
        {
          title: 'Descarga inmediata',
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
  async asyncData({ $axios }) {
    try {
      const getBooks = await $axios.$get(`${process.env.URL_SERVER}/api/books`)
      const getOfferWeek = await $axios.$get(
        `${process.env.URL_SERVER}/api/offer-week`
      )

      return {
        newBooks: getBooks.data,
        offerWeek: getOfferWeek.data
      }
    } catch (err) {
      console.log(err)
    }
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

.granger__books-title-new {
  margin-bottom: 30px;
}

.granger__books-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
