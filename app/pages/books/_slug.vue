<template>
  <div class="granger__book-container">
    <div class="container">
      <div class="granger__book-title-container">
        <h1 class="is-size-3">{{ book.title }}</h1>
      </div>
      <div class="columns">
        <div class="column is-6 granger__book-cover-container">
          <img
            class="granger__book-img"
            :src="`${server}/uploads/cover/${book.slug}/${book.cover}`"
            :alt="book.title"
          />
        </div>
        <div class="column is-6">
          <div class="granger__book-details-container">
            <div class="granger__book-stars-container">
              <Stars :stars="book.stars" />
            </div>
            <p class="is-size-1 has-text-info granger__book-price">$ {{ book.price }}</p>
            <div class="tags">
              <span class="tag is-info" v-for="(genre, i) in book.genre" :key="i">{{ genre }}</span>
            </div>
            <p>
              Autor/Autores:
              <b>{{ book.authors }}</b>
            </p>
            <p>{{ book.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    <Newsletter style="margin-top: 100px;" />
  </div>
</template>

<script>
// Components
import Newsletter from '~/components/home/Newsletter'
import Stars from '~/components/books/Stars'

export default {
  name: 'Books-details',
  transition: 'fade',
  head() {
    return {
      title: `${this.book.title} | Granger`
    }
  },
  components: {
    Newsletter,
    Stars
  },
  data() {
    return {
      server: process.env.URL_SERVER,
      book: {},
      isLoading: false,
      error: null
    }
  },
  async asyncData({ $axios, params }) {
    return await $axios
      .$get(`${process.env.URL_SERVER}/api/books/slug/${params.slug}`)
      .then(res => {
        return { book: res.data }
      })
  }
}
</script>

<style lang="scss">
.granger__book-container {
  .granger__book-stars-container {
    font-size: 24px;

    i {
      margin-right: 5px;
    }
  }
}
</style>

<style scoped lang="scss">
.granger__book-container {
  margin-top: 50px;

  .granger__book-title-container {
    margin-bottom: 30px;
    text-align: center;
  }

  .granger__book-cover-container {
    text-align: right;

    .granger__book-img {
      width: 260px;
      height: 400px;
      -o-object-fit: cover;
      object-fit: cover;
      border-radius: 10px;
      margin-right: 100px;
    }
  }

  .granger__book-details-container {
    .granger__book-price {
      margin-top: 0;
    }

    p {
      margin-top: 10px;
    }
  }
}

@media (max-width: 1024px) {
  .granger__book-container {
    .granger__book-cover-container {
      text-align: center;

      .granger__book-img {
        margin-right: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .granger__book-container {
    .granger__book-cover-container {
      text-align: center;
    }

    .granger__book-details-container {
      padding: 20px;

      .granger__book-stars-container,
      .granger__book-price {
        text-align: center;
      }

      .tags {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>