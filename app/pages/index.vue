<template>
  <div>
    <CarouselImages />

    <div class="container granger__whatweoffer-container">
      <WhatWeOffer v-for="(offer, i) in whatWeOffer" :key="i" :offer="offer" />
    </div>

    <div class="container" v-show="featuredBooks.length">
      <h1 class="granger__books-title is-size-2 has-text-centered">Libros Destacados</h1>
      <Notification v-if="errors.loadFeatured" :message="errors.loadFeatured" type="is-danger" />
      <CarouselFeatured v-else :books="featuredBooks" />
    </div>

    <!-- <OfferWeek v-if="errors.offerWeekAvailable" :book="books[0]" /> -->

    <div class="container" v-show="newBooks.length">
      <h1
        class="granger__books-title granger__books-title-new is-size-2 has-text-centered"
      >Nuevos Libros</h1>
      <div class="granger__books-container">
        <Notification
          v-if="errors.loadBooks"
          :message="errors.loadBooks"
          type="is-danger"
          style="width: 100%"
        />
        <BookCard v-else v-for="book in newBooks" :key="book.uuid" :book="book" />
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
      errors: {
        loadBooks: null,
        loadFeatured: null,
        offerWeekAvailable: false
      },
      newBooks: [],
      featuredBooks: [],
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
    return await $axios
      .$get(`${process.env.URL_SERVER}/api/books`)
      .then(res => {
        return {
          newBooks: res.data,
          featuredBooks: []
        }
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

.granger__books-title-new {
  margin-bottom: 30px;
}

.granger__books-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
